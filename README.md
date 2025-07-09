# 🧠 Ollama RAG Kit

A lightweight Retrieval-Augmented Generation (RAG) service using **Ollama** (local LLM) and **Pinecone** for vector search. Built for developers and teams who want to integrate AI-powered contextual responses with speed, control, and local inference.

---

## 🔧 Features

- `/query`: Query endpoint that retrieves relevant chunks from Pinecone and generates response using Ollama
- `/ingest`: Utility to parse and embed documents into Pinecone
- Token-level logging and latency tracking (WIP)
- Pluggable design for local vs cloud LLMs (Ollama / OpenAI)
- Ready-to-use REST API endpoints with JSON I/O

---

## 📁 Project Structure
/pinecone-ollama-express
├── routes/
│ ├── query.js # Main query handler
│ └── ingest.js # Vector DB ingestion utility
├── services/
│ ├── ollama.js # TBD
│ └── pinecone.js # Common pinecone index
├── utils/
│ └── logger.js # TBD
├── .env
└── server.js


---

## 🚀 Quick Start

### 1. Clone + Install

```bash
git clone https://github.com/yourname/pinecone-ollama-express.git
cd pincone-ollama-express
npm install
