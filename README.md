# DeepDoc

DeepDoc is a full-stack, AI-powered PDF intelligence app that lets users upload documents and chat with them using retrieval-augmented generation (RAG).  
It is built to demonstrate practical AI engineering skills for production use cases: document ingestion, semantic chunking, vector search, grounded LLM prompting, and scalable web delivery.

---

## Why this project

Most "chat with PDF" demos stop at basic retrieval. DeepDoc focuses on production-minded improvements:

- Better context quality with semantic chunking and chunk merging
- Grounded answers constrained to retrieved evidence
- Defensive reliability (timeouts, retries, and fallback behavior)
- End-to-end application delivery (UI, APIs, DB, vector store, deployment)

This repository is aimed at showcasing AI role readiness across both model-centric and software engineering dimensions.

---

## Core Features

- Upload and process PDF files
  - Extracts raw text from PDF files
  - Stores the original file in Vercel Blob
- Intelligent document chunking pipeline
  - Sentence-aware segmentation
  - Embedding-based topic shift detection
  - Similarity-based chunk merging
- Embedding generation with Gemini embeddings (`text-embedding-004`)
  - Batch embedding support
  - Timeout and retry behavior
  - In-memory cache to reduce duplicate embedding calls
- Vector indexing and retrieval with Pinecone
  - Namespace isolation per uploaded document
  - Metadata sanitization before upsert
  - Similarity threshold filtering and redundancy deduplication
- Grounded QA with Gemini (`gemini-2.5-flash`)
  - Strict prompt instructions to stay within retrieved context
  - Graceful "insufficient context" responses
  - API-side retries with exponential backoff for transient failures
- Multi-chat experience
  - Chat history persisted in PostgreSQL (Neon) via Drizzle ORM
  - Sidebar navigation across uploaded documents
  - Integrated PDF viewer + conversation panel

---

## AI/ML Design Highlights (for recruiters)

- **RAG pipeline design**
  - Query embedding -> vector retrieval -> dedupe/rank -> token-budget packing -> grounded generation
- **Retrieval quality controls**
  - Score thresholding + text redundancy suppression before context assembly
  - Configurable `topK`, score thresholds, and token budget through environment variables
- **Robust inference behavior**
  - Timeout wrappers and retries for both embedding and generation calls
  - Defensive request validation and upstream error handling in API routes
- **Prompt engineering for factuality**
  - Explicit grounding rules
  - Clear constraints when context is missing or partial
- **Production-ready full-stack integration**
  - Next.js App Router APIs, server actions, persistent storage, cloud vector DB, and deployable infra

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, shadcn/ui patterns, TanStack Query
- **Backend:** Next.js Route Handlers + Server Actions, TypeScript
- **AI:** Google Gemini (`gemini-2.5-flash`, `text-embedding-004`)
- **Vector DB:** Pinecone
- **Relational DB:** Neon PostgreSQL + Drizzle ORM
- **File Storage:** Vercel Blob
- **Auth (pages scaffolded):** Clerk sign-in/sign-up routes

---

## Architecture Overview

1. User uploads a PDF from the landing page.
2. Server extracts text (`pdf-parse`) and stores the file in Vercel Blob.
3. Text is chunked using sentence boundaries + semantic shift detection.
4. Chunk embeddings are generated and upserted to Pinecone (namespace = file key).
5. A chat record is created in PostgreSQL.
6. On each user question:
   - Generate embedding for the question
   - Retrieve top matches from Pinecone
   - Filter and dedupe context
   - Pack context within a token budget
   - Ask Gemini with strict grounding instructions
7. Persist user + assistant messages in PostgreSQL and render in chat UI.

---

## Repository Structure

```txt
app/
  api/
    chat/route.ts           # grounded LLM response endpoint
    get-messages/route.ts   # chat history fetch endpoint
  chat/[id]/page.tsx        # chat workspace (sidebar + pdf + messages)
components/
  PDFUpload.tsx             # upload flow
  ChatComponent.tsx         # conversation UI and mutation flow
  ChatSideBar.tsx           # chat/document navigation
  PDFViewer.tsx             # document preview panel
lib/
  pdf-process.ts            # upload + parse + chunk + embed + index pipeline
  chunking.ts               # semantic chunking logic
  embedding.ts              # embedding generation, retries, cache
  context.ts                # retrieval, dedupe, token budget packing
  pineconedb.ts             # Pinecone upsert helpers
  db/                       # Drizzle schema + Neon client
```

---

## Local Setup

### 1) Clone and install

```bash
git clone <your-repo-url>
cd DeepDoc
npm install
```

### 2) Configure environment variables

Create a `.env` file in project root:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
DATABASE_URL=your_neon_database_url

# Optional (defaults are present in code)
PINECONE_INDEX=chatpdf
CONTEXT_TOP_K=20
CONTEXT_SCORE_THRESHOLD=0.7
CONTEXT_MAX_TOKENS=750
```

Also configure Vercel Blob token for upload support in your environment.

### 3) Run database migration

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4) Start development server

```bash
npm run dev
```

App runs on `http://localhost:3000`.

---

## Key Engineering Decisions

- **Semantic chunking over naive fixed windows**  
  Improves retrieval precision by aligning chunks to meaning boundaries.

- **Two-stage context hygiene (threshold + dedupe)**  
  Reduces noise and repeated evidence before generation.

- **Token-budgeted context packing**  
  Keeps prompts efficient and predictable under model limits.

- **Resilience-first API handling**  
  Retries and timeout logic reduce transient provider/network failures.

---

## Known Limitations / Next Improvements

- Add citation spans and source highlighting in final answers
- Add automated RAG evaluation set (faithfulness + answer relevance)
- Add background job queue for large PDF ingestion
- Add multi-tenant auth isolation across chats
- Add streaming response UX for long completions

---

## Portfolio Value for AI Roles

DeepDoc demonstrates readiness for roles such as:

- AI Engineer
- LLM Engineer
- Applied ML Engineer
- GenAI Full-Stack Engineer

Evidence shown in this project:

- Practical RAG architecture and implementation
- Embedding and retrieval optimization mindset
- Prompt grounding and hallucination control
- End-to-end product thinking from model to deployment
- Strong TypeScript/Next.js engineering execution around AI systems

---

## License

MIT (or your preferred license).