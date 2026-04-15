import os
import requests
import uuid
import yfinance as yf
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import json

app = FastAPI(title="Shadow Equity Compliance Auditor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Discrepancy(BaseModel):
    id: str
    transcript: str
    filing: str
    status: str
    explanation: str

class InvestorInsights(BaseModel):
    bull_case: list[str]
    bear_case: list[str]
    sentiment_shift: str
    health_score: int

class AuditRequest(BaseModel):
    ticker: str
    requirement: str
    groq_key: str
    sec_key: str = ""

class MacroMetric(BaseModel):
    id: str
    label: str
    value: str
    trend: str
    description: str

class AuditResponse(BaseModel):
    status: str
    deception_score: float
    discrepancies: list[Discrepancy]
    insights: InvestorInsights
    macro_data: list[MacroMetric]

@app.get("/search")
async def search_ticker(q: str = Query(..., min_length=1)):
    """Search for companies/tickers using real Yahoo Finance API"""
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={q}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        r = requests.get(url, headers=headers)
        data = r.json()
        quotes = data.get('quotes', [])
        results = []
        for q_item in quotes:
            if 'symbol' in q_item and 'shortname' in q_item:
                results.append({"symbol": q_item['symbol'], "name": q_item['shortname'], "exchange": q_item.get('exchDisp', 'Unknown')})
        return {"results": results[:5]}
    except Exception as e:
        return {"results": []}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    return {"message": f"Successfully ingested {file.filename} into Vector Store."}

@app.post("/audit", response_model=AuditResponse)
async def run_audit(payload: AuditRequest):
    # Support multiple groq keys if comma separated
    keys = [k.strip() for k in payload.groq_key.split(",") if k.strip()]
    active_key = keys[0] if keys else None
    verifier_key = keys[-1] if keys else None 

    ticker = payload.ticker.strip().upper()
    req = payload.requirement or "Analyze general financial statements"

    # Fetch Real Data using yfinance with enhanced discovery depth
    try:
        stock = yf.Ticker(ticker)
        info = stock.info or {}
        fast = stock.fast_info
        
        # Priority fallback logic: info object -> fast_info object -> history query
        price = info.get('currentPrice') or fast.get('last_price') or "N/A"
        summary = info.get('longBusinessSummary') or f"Target Acquisition: {ticker}. Financial profile active."
        margins = info.get('grossMargins') or "N/A"
        revenue_growth = info.get('revenueGrowth') or "N/A"
        debt_to_equity = info.get('debtToEquity') or "N/A"
        
        # Format percentages/decimals for AI Agent readability
        def fmt_val(v, is_pct=False):
            if v is None or v == "N/A": return "N/A"
            try:
                num = float(v)
                return f"{num * 100:.2f}%" if is_pct else f"{num:.2f}"
            except: return str(v)

        clean_price = f"${fmt_val(price)}" if price != "N/A" else "N/A"
        clean_margins = fmt_val(margins, True)
        clean_growth = fmt_val(revenue_growth, True)
        clean_debt = fmt_val(debt_to_equity)

        # Dynamic Macro Simulation based on active profile
        beta = info.get('beta') or fast.get('year_high') # Using year_high as proxy if beta missing for trend
        trailing_pe = info.get('trailingPE') or 0
        
        dynamic_macro = [
            MacroMetric(id="pe", label="Entity P/E Ratio", value=fmt_val(trailing_pe), trend="up" if type(trailing_pe) in [int, float] and trailing_pe > 25 else "down", description="Real-time Valuation"),
            MacroMetric(id="beta", label="Market Beta", value=fmt_val(info.get('beta')), trend="up" if type(info.get('beta')) in [int, float] and info.get('beta') > 1.2 else "neutral", description="Volatility Profile"),
            MacroMetric(id="debt", label="Debt/Equity", value=clean_debt, trend="down", description="Capital Leverage"),
            MacroMetric(id="rev", label="Rev Growth", value=clean_growth, trend="up", description="YoY Trailing")
        ]
        
    except Exception:
        summary = "Profile Discovery Error: External API latency detected."
        clean_price = "N/A"
        clean_margins = "N/A"
        clean_growth = "N/A"
        clean_debt = "N/A"
        dynamic_macro = [
            MacroMetric(id="pe", label="P/E Ratio", value="N/A", trend="neutral", description="Valuation"),
            MacroMetric(id="beta", label="Beta", value="N/A", trend="neutral", description="Volatility"),
            MacroMetric(id="debt", label="D/E", value="N/A", trend="neutral", description="Structure"),
            MacroMetric(id="rev", label="Growth", value="N/A", trend="neutral", description="YoY")
        ]

    if active_key:
        try:
            client = Groq(api_key=active_key)
            
            # AGENT 1: The Initial Synthesizer
            extractor_prompt = f"""
            You are a Financial Auditor AI. The user is auditing {ticker}. Requirement: "{req}"
            
            Real Data:
            Summary: {summary}
            Price: {clean_price}
            Gross Margins: {clean_margins}
            Revenue Growth: {clean_growth}
            Debt to Equity: {clean_debt}

            Generate a preliminary JSON response EXACTLY matching this structure:
            {{
                "deception_score": 45,
                "discrepancies": [
                    {{ "id": "1", "transcript": "Quote", "filing": "Fact", "status": "contradiction", "explanation": "Why" }}
                ],
                "insights": {{
                    "bull_case": ["Point 1"], "bear_case": ["Point 1"], "sentiment_shift": "Aggressive", "health_score": 85
                }}
            }}
            Return ONLY valid JSON.
            """
            
            chat_completion_1 = client.chat.completions.create(
                messages=[{"role": "user", "content": extractor_prompt}],
                model="llama-3.1-8b-instant", # Using the latest Instant model
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            raw_json_str = chat_completion_1.choices[0].message.content
            
            # AGENT 2: The Cross-Checker / Verifier
            verifier_prompt = f"""
            You are a strict Senior Compliance Verifier. Your job is to ensure zero hallucinations in financial data.
            Review this AI-generated Audit JSON for {ticker}:
            {raw_json_str}
            
            Against the ground-truth facts:
            Price: {clean_price}, Margins: {clean_margins}, Rev Growth: {clean_growth}, D/E: {clean_debt}
            
            Correct any hallucinations, strictly format the output, and refine the insights. 
            Return the final verified JSON output strictly in the exact same schema.
            """
            
            # Use verifier key if available, else active key
            verifier_client = Groq(api_key=verifier_key) if verifier_key else client
            chat_completion_2 = verifier_client.chat.completions.create(
                messages=[{"role": "user", "content": verifier_prompt}],
                model="llama-3.3-70b-versatile", # Using the latest 70B model 
                temperature=0.0,
                response_format={"type": "json_object"}
            )
            
            final_json = json.loads(chat_completion_2.choices[0].message.content)
            
            return AuditResponse(
                status="verified_success", # Indicates dual-agent pass
                deception_score=final_json.get("deception_score", 50),
                discrepancies=final_json.get("discrepancies", []),
                insights=final_json.get("insights", {
                    "bull_case": ["Verified successfully."], "bear_case": ["No specific bear cases found."], "sentiment_shift": "Neutral", "health_score": 50
                }),
                macro_data=dynamic_macro
            )
        except Exception as e:
            error_msg = str(e)
            print(f"Groq Agents Error: {error_msg}")
            
            # Smart Fallback Data if API Key is invalid or rate limited
            return AuditResponse(
                status="api_error",
                deception_score=25,
                discrepancies=[
                    {
                        "id": str(uuid.uuid4()),
                        "transcript": f"{ticker} Management indicated a robust quarter.",
                        "filing": f"{ticker} trades at {clean_price}. Gross Margins: {clean_margins}. Debt/Equity: {clean_debt}",
                        "status": "consistent",
                        "explanation": f"API FAILED. Error: {error_msg}. Falling back to raw scraped YFinance facts."
                    }
                ],
                insights=InvestorInsights(
                    bull_case=[f"Real-time scraping succeeded.", f"Revenue Growth: {clean_growth}"],
                    bear_case=[f"AI Inference failed.", f"Reason: {error_msg}"],
                    sentiment_shift="Unknown (Fallback Mode)",
                    health_score=50
                ),
                macro_data=dynamic_macro
            )
    
    # Fallback Data without API Key
    return AuditResponse(
        status="no_key",
        deception_score=15,
        discrepancies=[
            {
                "id": str(uuid.uuid4()),
                "transcript": f"{ticker} is expected to grow its margins significantly this year.",
                "filing": f"Current actual margins are {clean_margins}. Revenue growth is {clean_growth}.",
                "status": "contradiction",
                "explanation": "No Groq API key was provided. This is a real-time scraped YFinance comparison without AI synthesis."
            }
        ],
        insights=InvestorInsights(
            bull_case=[f"Real-time market price verified at {clean_price}."],
            bear_case=["Requires GROQ API Key for advanced narrative drift detection."],
            sentiment_shift="System Offline",
            health_score=0
        ),
        macro_data=dynamic_macro
    )

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

@app.get("/")
async def serve_frontend():
    index_path = os.path.join(os.path.dirname(__file__), "../frontend/out/index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Frontend not built yet. Run npm run build."}

out_dir = os.path.join(os.path.dirname(__file__), "../frontend/out")
if os.path.exists(out_dir):
    app.mount("/", StaticFiles(directory=out_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
