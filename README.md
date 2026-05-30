# PrepPulse - AI Interview Preparation Platform

PrepPulse is a comprehensive AI-powered interview preparation platform that helps users practice job interviews with real-time voice interaction and detailed feedback analysis. Built with Next.js 15, Firebase, and Vapi AI, it provides an immersive interview experience with intelligent assessment.

## 🚀 Features

### Core Functionality

- **AI-Powered Voice Interviews**: Real-time voice conversations with AI interviewer using Vapi AI
- **Dynamic Question Generation**: AI-generated interview questions based on role, level, and tech stack
- **Comprehensive Feedback System**: Detailed analysis with scoring across multiple categories
- **User Authentication**: Secure Firebase-based authentication system
- **Interview Management**: Track past interviews and upcoming practice sessions

### Key Components

- **Voice Interview Agent**: Real-time voice interaction with AI interviewer
- **Question Generation API**: Dynamic interview questions using Google Gemini AI
- **Feedback Analysis**: AI-powered assessment with detailed scoring and recommendations
- **Interview Dashboard**: Personal interview history and performance tracking
- **Tech Stack Visualization**: Display of relevant technologies for each interview

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend & Services

- **Firebase** - Authentication and Firestore database
- **Firebase Admin SDK** - Server-side Firebase operations
- **Vapi AI** - Voice AI platform for real-time conversations
- **Google AI SDK** - AI-powered question generation and feedback analysis
- **Next.js API Routes** - Serverless API endpoints

### AI Integration

- **Google Gemini 2.0 Flash** - Advanced AI for feedback analysis
- **Google Gemini 1.5 Flash** - Question generation
- **Vapi AI** - Voice conversation handling
- **Deepgram** - Speech-to-text transcription

## 📁 Project Structure

```
ai-interview-prep/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/page.tsx      # Sign in page
│   │   └── sign-up/page.tsx      # Sign up page
│   ├── (root)/                   # Main application routes
│   │   ├── interview/            # Interview functionality
│   │   │   ├── [id]/             # Dynamic interview pages
│   │   │   │   ├── page.tsx      # Interview session
│   │   │   │   └── feedback/     # Feedback display
│   │   │   └── page.tsx          # Interview generation
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Dashboard
│   ├── api/                      # API routes
│   │   └── vapi/generate/        # Interview generation endpoint
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── Agent.tsx                 # Voice interview agent
│   ├── AuthForm.tsx              # Authentication forms
│   ├── InterviewCard.tsx         # Interview display cards
│   ├── DisplayTechIcons.tsx      # Technology stack display
│   └── ui/                       # Reusable UI components
├── lib/                          # Utility libraries
│   ├── actions/                  # Server actions
│   │   ├── auth.action.ts        # Authentication logic
│   │   └── general.actions.tsx   # General database operations
│   ├── utils.ts                  # Utility functions
│   └── vapi.sdk.ts              # Vapi AI integration
├── firebase/                     # Firebase configuration
│   ├── admin.ts                  # Firebase Admin SDK
│   └── client.ts                 # Firebase Client SDK
├── constants/                    # Application constants
│   └── index.ts                  # Constants and schemas
└── types/                        # TypeScript type definitions
    ├── index.d.ts                # Global types
    └── vapi.d.ts                 # Vapi AI types
```

## 🔧 Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled
- Vapi AI account and API key
- Google AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-interview-prep
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:

   ```env
   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email

   # Vapi AI Configuration
   NEXT_PUBLIC_VAPI_WEB_API=your-vapi-api-key
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-workflow-id

   # Google AI Configuration
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### 1. User Authentication

- Users sign up/sign in using Firebase Authentication
- Session management with secure HTTP-only cookies
- Protected routes with server-side authentication

### 2. Interview Generation

- Users specify role, experience level, tech stack, and question type
- AI generates tailored interview questions using Google Gemini
- Questions are stored in Firestore for future use

### 3. Voice Interview Session

- Real-time voice conversation with AI interviewer
- Speech-to-text transcription using Deepgram
- Natural conversation flow with follow-up questions
- Session recording and transcript storage

### 4. AI-Powered Feedback

- Comprehensive analysis using Google Gemini 2.0 Flash
- Scoring across 5 categories:
  - Communication Skills
  - Technical Knowledge
  - Problem-Solving
  - Cultural & Role Fit
  - Confidence & Clarity
- Detailed strengths and improvement areas
- Overall assessment and recommendations

## 🔑 Key Features Explained

### Voice Interview Agent (`components/Agent.tsx`)

- Handles real-time voice conversations
- Manages call states (inactive, connecting, active, finished)
- Processes speech events and transcriptions
- Integrates with Vapi AI for natural conversation flow

### Question Generation API (`app/api/vapi/generate/route.ts`)

- Generates contextual interview questions
- Uses Google Gemini AI for intelligent question creation
- Supports different interview types (technical, behavioral, mixed)
- Stores generated interviews in Firestore

### Feedback System (`lib/actions/general.actions.tsx`)

- AI-powered interview analysis
- Structured scoring system with detailed comments
- Generates actionable feedback and recommendations
- Stores feedback data for user review

### Authentication System (`lib/actions/auth.action.ts`)

- Firebase-based user authentication
- Secure session management
- Server-side user verification
- Protected API routes and pages

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform:

- Firebase configuration
- Vapi AI API keys
- Google AI API key

## 📊 Database Schema

### Collections

- **users**: User profile information
- **interviews**: Generated interview questions and metadata
- **feedback**: AI-generated interview feedback and scores

### Key Fields

- User authentication and profile data
- Interview questions, role, tech stack, and metadata
- Feedback scores, comments, and assessment details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Vapi AI** - Voice AI platform for real-time conversations
- **Google AI** - Advanced AI models for question generation and analysis
- **Firebase** - Authentication and database services
- **Next.js** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework
#   P r e p P u l s e  
 #   P r e p P u l s e  
 #   P r e p P u l s e  
 #   P r e p P u l s e  
 #   P r e p P u l s e  
 