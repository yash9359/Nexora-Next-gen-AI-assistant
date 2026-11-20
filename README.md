# 🌌 Nexora — Next-Gen AI Assistant

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Groq-LPU_Inference-F05A28?style=for-the-badge" alt="Groq" />
  <img src="https://img.shields.io/badge/Package_Manager-Bun-FBF0DF?style=for-the-badge&logo=bun&logoColor=black" alt="Bun" />
</p>

**Nexora** is a high-performance, full-stack conversational AI assistant engineered for technical workflows, developer productivity, and everyday problem solving. Powered by ultra-fast Groq inference, the Vercel AI SDK, Next.js 16, and Prisma 7, Nexora delivers real-time token streaming with first-class rendering for code syntax highlighting, KaTeX math formulas, interactive Mermaid diagrams, and tool execution status.

---

## ⚡ Key Highlights & Features

- **⚡ Blazing Fast Streaming**: Powered by Groq LPUs (`@ai-sdk/groq` and Vercel AI SDK v4/v7) for near-instant response generation.
- **🎨 Rich Markdown & Media**:
  - 🖥️ **Code Highlighting**: Syntax-highlighted code blocks with Shiki.
  - 📊 **Mermaid Diagrams**: Native dynamic rendering with `@streamdown/mermaid`.
  - 🧮 **LaTeX / Math**: LaTeX formulas and mathematical equations via `@streamdown/math`.
  - 🌐 **CJK & Unicode Support**: Enhanced character support through `@streamdown/cjk`.
  - 🛠️ **Tool Execution Badges**: Real-time visual feedback indicators for AI tool calls.
- **🔐 Secure Authentication & Auto-Sync**: Seamless OAuth login with GitHub and Google via Clerk, with automatic user synchronization into PostgreSQL.
- **💬 Persistent Conversations**:
  - Complete conversation history saved per user in PostgreSQL.
  - Smart auto-titling based on your initial message.
  - Ability to rename, pin, and delete chats with cascading cleanup.
- **📱 Responsive & Accessible UI**:
  - Built with Tailwind CSS v4 and shadcn/ui primitives.
  - Seamless desktop sidebar and mobile drawer with device safe-area awareness.
  - Auto-scrolling to bottom with smart pause on user scroll (`use-stick-to-bottom`).
  - Dark and Light mode theme toggling with `next-themes`.

---

## 🏗️ Architecture & Flow Diagrams

### 1. High-Level Architecture Flow

```mermaid
flowchart LR
    subgraph Client ["Client Layer"]
        UI["Next.js 16 / React 19 UI"]
        TQ["TanStack Query Cache"]
        SD["Streamdown Renderer<br/>(Mermaid, Math, Shiki)"]
    end

    subgraph AuthProvider ["Authentication"]
        CLERK["Clerk Auth (Google/GitHub)"]
    end

    subgraph Server ["Server & Backend (App Router)"]
        API["POST /api/chat"]
        ACTIONS["Server Actions<br/>(Conversations & Sync)"]
        AUTH_GUARD["User Verification & Guard"]
    end

    subgraph Database ["Data Tier"]
        PRISMA["Prisma 7 ORM"]
        PG[("PostgreSQL Database")]
    end

    subgraph AI ["AI Engine"]
        SDK["Vercel AI SDK"]
        GROQ["Groq Cloud API<br/>(LPU Inference)"]
    end

    UI --> CLERK
    UI --> API
    UI --> ACTIONS
    API --> AUTH_GUARD
    AUTH_GUARD --> PRISMA
    ACTIONS --> PRISMA
    PRISMA --> PG
    API --> SDK
    SDK --> GROQ
    GROQ -.->|Tokens Stream| SDK
    SDK -.->|UI Message Stream| UI
    UI --> SD
    UI --> TQ
```

---

### 2. Message Request & Streaming Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User
    participant Client as 💻 Next.js Client
    participant Auth as 🔒 Clerk
    participant Route as 🚀 /api/chat
    participant DB as 🗄️ PostgreSQL (Prisma 7)
    participant Groq as ⚡ Groq AI (LPU)

    User->>Client: Types message & hits Send
    Client->>Auth: Validate user session
    Auth-->>Client: Session Verified
    Client->>Route: POST /api/chat (conversationId, message)
    Route->>Auth: Protect endpoint (auth.protect)
    Route->>DB: Verify conversation ownership & fetch history
    Route->>DB: Persist incoming user message
    Route->>Groq: Stream prompt + messages + system prompt
    
    loop Real-time Token Streaming
        Groq-->>Route: Stream response chunks
        Route-->>Client: UIMessageStream (text parts / tool calls)
        Client-->>User: Live render with Streamdown
    end

    Route->>DB: Save finalized assistant response
    Route-->>Client: Stream completed & synced
```

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Core framework, Server Components & Route Handlers |
| **UI Library** | [React 19](https://react.dev/) | Component architecture & state rendering |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | High-performance CSS and responsive layout engine |
| **UI Primitives** | [shadcn/ui](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/) | Accessible, themeable UI components |
| **AI Orchestration**| [Vercel AI SDK](https://sdk.vercel.ai/) & [@ai-sdk/groq](https://github.com/vercel/ai) | Streaming abstraction, message handling, and Groq integration |
| **LLM Provider** | [Groq](https://groq.com/) | Fast model inference (Default: `openai/gpt-oss-120b`) |
| **Database & ORM** | [Prisma 7](https://www.prisma.io/) & [PostgreSQL](https://www.postgresql.org/) | Relational storage with `@prisma/adapter-pg` driver adapter |
| **Authentication** | [Clerk](https://clerk.com/) | OAuth login (Google & GitHub), user identity, and session management |
| **Client State** | [TanStack React Query](https://tanstack.com/query) | Async state caching, cache invalidation, and UI synchronization |
| **Markdown Parsing**| [Streamdown](https://github.com/streamdown) | Streaming markdown with Shiki code, KaTeX math, and Mermaid diagrams |
| **Runtime & Tooling**| [Bun](https://bun.sh/) | Fast JavaScript/TypeScript package manager and runner |

---

## 📂 Project Structure

```text
Nexora-Next-gen AI assistant/
├── app/
│   ├── (auth)/sign-in/             # Custom Clerk sign-in routes
│   ├── (root)/                     # Main chat layout and workspace pages
│   │   ├── c/[id]/page.tsx         # Active conversation view
│   │   └── page.tsx                # Home / new conversation screen
│   ├── api/chat/route.ts           # Authenticated AI streaming route
│   └── sso-callback/page.tsx       # Clerk OAuth callback handler
├── components/
│   ├── ai-elements/                # Chat presentation (conversation, message, loader)
│   ├── providers/                  # Theme & React Query context providers
│   └── ui/                         # shadcn/ui and custom design system primitives
├── features/
│   ├── ai/                         # Groq model definitions & chat store persistence
│   ├── auth/                       # User onboarding & authentication guards
│   ├── conversation/               # Sidebar, chat-shell, composer, and conversation actions
│   ├── home/                       # Initial chat launch actions
│   └── messages/                   # System prompt definitions and message actions
├── lib/
│   ├── db.ts                       # Prisma Client with PostgreSQL adapter
│   └── utils.ts                    # Class name merging (clsx / tailwind-merge)
├── prisma/
│   └── schema.prisma               # PostgreSQL relational schema definition
└── public/                         # Static assets and icons
```

---

## 📊 Database Schema

Nexora leverages Prisma 7 with PostgreSQL. The schema provides strong relationship integrity and cascading deletions:

```mermaid
erDiagram
    USER ||--o{ CONVERSATION : "owns"
    CONVERSATION ||--o{ MESSAGE : "contains"

    USER {
        string id PK
        string clerkId UK
        string email UK
        string firstName
        string lastName
        string imageUrl
        datetime createdAt
        datetime updatedAt
    }

    CONVERSATION {
        string id PK
        string userId FK
        string title
        string model
        text systemPrompt
        boolean isPinned
        boolean isArchived
        datetime lastMessageAt
        datetime createdAt
        datetime updatedAt
    }

    MESSAGE {
        string id PK
        string conversationId FK
        MessageRole role
        MessageStatus status
        text content
        json parts
        json metadata
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed and set up:
- **[Bun](https://bun.sh/)** `v1.4.0+` (declared package manager)
- **[PostgreSQL](https://www.postgresql.org/)** database (local or hosted, e.g., Supabase, Neon, Railway)
- **[Clerk Account](https://clerk.com/)** (with Google or GitHub OAuth enabled)
- **[Groq Cloud Account](https://console.groq.com/)** (API key for LPU model inference)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/nexora.git
cd nexora
```

### Step 2: Install Dependencies

```bash
bun install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/nexora?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Groq Cloud API
GROQ_API_KEY="gsk_..."
```

> **Note for Clerk Configuration:**
> - In your Clerk dashboard, configure your redirect URLs to include:
>   - Sign-in: `http://localhost:3000/sign-in`
>   - SSO Callback: `http://localhost:3000/sso-callback`
>   - Post sign-in URL: `http://localhost:3000/`

### Step 4: Initialize the Database

Push the Prisma schema to your PostgreSQL database:

```bash
bunx prisma generate
bunx prisma db push
```

### Step 5: Start the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `bun dev` | Starts the Next.js development server with Turbopack |
| `bun run build` | Generates Prisma client and compiles production build |
| `bun start` | Starts the production server |
| `bunx prisma studio` | Opens interactive visual GUI for PostgreSQL database |
| `bunx prisma db push` | Pushes the schema state directly to your database |
| `bunx prisma generate` | Regenerates Prisma Client types |
| `bunx tsc --noEmit` | Validates TypeScript types across the project |

---

## 🛡️ Security & Privacy

- **Protected API Endpoints**: `/api/chat` validates active Clerk sessions before reading or processing messages.
- **Tenant Isolation**: Database operations enforce `userId` checks on all conversation access, modification, and deletion.
- **Defensive System Prompt**: Embedded prompt mitigates prompt-injection attacks and instruction overrides while preserving technical precision.
- **Cascade Deletion**: When a conversation or user is deleted, all associated messages are cleanly pruned from the database.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a pull request:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
