from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
import uuid

# Dummy setup for LangGraph / Groq for demonstration
# In production, this would use langgraph, langchain_groq, etc.

app = FastAPI(title="Shadow Equity Compliance Auditor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB client (local)
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="financial_docs")

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

class AuditResponse(BaseModel):
    status: str
    deception_score: float
    discrepancies: list[Discrepancy]
    insights: InvestorInsights
    
# ... existing upload route is fine to skip editing ...
@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    return {"message": f"Successfully ingested {file.filename} into Vector Store."}

@app.post("/audit", response_model=AuditResponse)
async def run_audit(payload: AuditRequest):
    # Simulate a LangGraph agent workflow:
    # 1. "Skeptical Auditor" Agent queries Chroma for historical standard financial data
    # 2. compares with current earnings transcript narrative
    # 3. utilizes Groq Llama 3 70B for sub-second text comparison

    # Dummy response returning mock narrative drift
    return AuditResponse(
        status="success",
        deception_score=82,
        discrepancies=[
            {
                "id": str(uuid.uuid4()),
                "transcript": "Our data center revenue grew exponentially, driving record margins of over 75% this quarter.",
                "filing": "Data Center segment gross margin was 71.2%, negatively impacted by inventory write-offs.",
                "status": "contradiction",
                "explanation": "Transcript claims margins over 75%, while 10-Q filing states 71.2%."
            }
        ],
        insights=InvestorInsights(
            bull_case=[f"Core operations for {payload.ticker} show strong revenue momentum."],
            bear_case=["Unaddressed supply chain friction exposes short term volatility."],
            sentiment_shift="Aggressive",
            health_score=88
        )
    )

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Create fallback index route if root is hit
@app.get("/")
async def serve_frontend():
    index_path = os.path.join(os.path.dirname(__file__), "../frontend/out/index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Frontend not built yet. Run npm run build."}

# Mount the static site
out_dir = os.path.join(os.path.dirname(__file__), "../frontend/out")
if os.path.exists(out_dir):
    app.mount("/", StaticFiles(directory=out_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
