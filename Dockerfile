FROM python:3.11-slim

WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Copy everything
COPY . /app

# Build frontend
WORKDIR /app/frontend
# Explicitly set Next.js to standalone or static export. But we will just run npm install and build.
RUN npm install
RUN npm run build
# (We might need an express server or we can just run Next.js server on 3000 and FastAPI on 7860, but HF only exposes one port: 7860)

# Setup backend
WORKDIR /app/backend
RUN pip install --no-cache-dir fastapi uvicorn pydantic groq chromadb pymupdf4llm langgraph uvicorn[standard] python-multipart openai

# A simple bash script to bridge the two: actually HF spaces allows running an entrypoint.
# We can use a unified starter script.
WORKDIR /app

# Create a start script
RUN echo '#!/bin/bash\n\
cd /app/backend\n\
uvicorn main:app --host 0.0.0.0 --port 7860\n\
' > start.sh
RUN chmod +x start.sh

# HF default port
EXPOSE 7860

CMD ["./start.sh"]
