# StudyPal

A web application that transforms user-provided study materials (text, PDFs) into an interactive learning session with AI-generated flashcards, quizzes, and a chat-based Q&A.

##  Features

- **Upload Study Materials:** Seamlessly upload text or PDF files to create study contexts.
- **AI-Generated Flashcards:** Automatically extract key concepts and definitions into interactive flashcards.
- **Dynamic Quizzes:** Test your knowledge with AI-generated quizzes based on your specific study materials.
- **Interactive Q&A Chat:** Chat with your study materials to ask questions, get explanations, and clarify complex topics.
- **Modern UI/UX:** Beautiful, responsive, and animated user interface using the latest web technologies.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Animations:** GSAP & Three.js
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend (API)
- **Framework:** Hono (running on Cloudflare Workers)
- **Database:** Neon (Serverless PostgreSQL)
- **ORM:** Drizzle ORM
- **AI Integration:** Mistral AI
- **PDF Parsing:** pdf-parse

##  Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm, yarn, or pnpm
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for Cloudflare Workers)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Study-flashcard
   ```

2. **Install Backend Dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

#### Backend Setup

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Create a `.dev.vars` file (for local development with Wrangler) and `.env` (for Drizzle) and configure your environment variables:
   ```env
   DATABASE_URL="your-neon-postgres-connection-string"
   MISTRAL_API_KEY="your-mistral-api-key"
   ```
3. Run database migrations:
   ```bash
   npm run db:generate
   npm run db:push
   ```

### Running the App Locally

You will need two terminal tabs to run both the frontend and the backend simultaneously.

**Terminal 1: Start the Backend (API)**
```bash
cd api
npm run dev
```

**Terminal 2: Start the Frontend**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port specified by Vite), and the backend will run at the port specified by Cloudflare Wrangler (usually `http://localhost:8787`).

## 📁 Project Structure

- `/api` - Contains the backend Cloudflare Worker, Hono API routes, and Drizzle database schemas.
- `/frontend` - Contains the React application, UI components, and state management.

##  Scripts Overview

### Frontend (`/frontend`)
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the frontend for production.
- `npm run lint` - Runs ESLint to check for code issues.

### Backend (`/api`)
- `npm run dev` - Starts the Wrangler development server.
- `npm run db:generate` - Generates Drizzle migrations based on your schema.
- `npm run db:push` - Pushes schema changes directly to the Neon database.
- `npm run db:studio` - Opens the Drizzle Studio to view and edit database records.
- `npm run deploy` - Deploys the worker to Cloudflare.
