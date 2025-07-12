# CodeAI - AI-Powered Code Generation Chatbot

A modern, full-stack AI chatbot application that generates beautiful HTML and CSS code using Google's Gemini AI. Built with Next.js 15, TypeScript, and a robust authentication system.

🌐 **Live Demo**: [https://ai-chatbot-ten-gilt-67.vercel.app/](https://ai-chatbot-ten-gilt-67.vercel.app/)

## ✨ Features

### 🤖 AI-Powered Code Generation
- **Google Gemini AI Integration**: Uses Gemini 2.0 Flash for intelligent code generation
- **HTML/CSS Specialization**: Expert system prompt for clean, semantic HTML and CSS
- **Real-time Streaming**: Instant code generation with streaming responses
- **Code Extraction**: Automatically extracts and displays generated code in a dedicated panel

### 💬 Advanced Chat Interface
- **Conversation Management**: Persistent chat history with conversation IDs
- **Split Panel Layout**: Chat interface with dedicated code preview panel
- **Message History**: View all previous conversations and generated code
- **Real-time Updates**: Live streaming of AI responses

### 🔐 Authentication & Security
- **NextAuth.js Integration**: Secure user authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Session-based access control
- **User-specific Data**: Isolated chat history per user

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Sleek dark interface optimized for coding
- **Component Library**: Radix UI components for accessibility
- **Custom Animations**: Smooth transitions and interactions

### 🗄️ Database & Storage
- **PostgreSQL Database**: Neon serverless database for scalability
- **Drizzle ORM**: Type-safe database operations
- **Message Persistence**: Store all conversations and generated code
- **User Management**: Secure user data storage

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons

### Backend & AI
- **Google AI SDK**: Official SDK for Gemini AI integration
- **NextAuth.js 5**: Authentication framework
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Primary database (Neon serverless)
- **bcryptjs**: Password hashing

### Development Tools
- **ESLint**: Code linting and formatting
- **Drizzle Kit**: Database migrations and schema management
- **TypeScript**: Static type checking

## 📦 Key Dependencies

### Core Dependencies
```json
{
  "@ai-sdk/google": "^1.2.22",        // Google AI SDK
  "@ai-sdk/react": "^1.2.12",         // React hooks for AI
  "ai": "^4.3.17",                    // Vercel AI SDK
  "next": "15.3.5",                   // Next.js framework
  "react": "^19.0.0",                 // React library
  "next-auth": "^5.0.0-beta.29",      // Authentication
  "drizzle-orm": "^0.44.2",           // Database ORM
  "@neondatabase/serverless": "^1.0.1" // PostgreSQL client
}
```


### Development Dependencies
```json
{
  "drizzle-kit": "^0.31.4",           // Database migrations
  "tailwindcss": "^4",                // CSS framework
  "typescript": "^5",                  // Type checking
  "eslint": "^9"                       // Code linting
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai_chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google AI
   GOOGLE_API_KEY="your-google-ai-api-key"
   ```

4. **Database Setup**
   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai_chat/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── chat/          # AI chat endpoint
│   │   │   └── messages/      # Message management
│   │   ├── auth/              # Auth pages (signin/signup)
│   │   ├── chat/              # Chat interface pages
│   │   └── history/           # Conversation history
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── ChatInterface.tsx  # Main chat component
│   │   ├── CodePanel.tsx     # Code preview panel
│   │   └── ConversationPanel.tsx # Chat messages panel
│   └── lib/                  # Utility functions
├── db/                       # Database configuration
│   ├── schema.ts             # Database schema
│   └── drizzle.ts            # Database connection
└── drizzle/                  # Database migrations
```

## 🔧 Configuration

### Authentication Flow
1. User signs up with email/password
2. Credentials are hashed with bcryptjs
3. NextAuth.js manages sessions
4. Protected routes require authentication

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
GOOGLE_API_KEY="your-google-ai-api-key"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) for AI integration
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**
