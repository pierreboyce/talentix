# CV SaaS Platform

A comprehensive career development platform built with Next.js that helps users create professional CVs, prepare for interviews, and advance their careers.

## 🚀 Features

- **AI-Powered CV Analysis**: Get intelligent feedback and suggestions for your resume
- **Interview Preparation**: Practice with AI-powered mock interviews
- **Video Interview Analysis**: Receive feedback on your interview performance
- **Job Search Integration**: Find relevant job opportunities
- **Career Guidance**: Personalized career advice and tips
- **Certificate Generation**: Earn certificates for completed assessments
- **Subscription Management**: Tiered access with Stripe integration
- **OAuth Authentication**: Sign in with Google or Microsoft
- **Newsletter Integration**: Stay updated with career tips and opportunities

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe for subscription management
- **AI Integration**: OpenAI GPT for content analysis
- **Email**: SendGrid for transactional emails
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Stripe account (for payments)
- SendGrid account (for emails)
- OAuth app credentials (Google/Microsoft)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-cv-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Fill in your actual API keys and configuration values in `.env.local`.

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔑 Environment Variables

See `env.example` for all required environment variables. Key variables include:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `SENDGRID_API_KEY`: SendGrid API key for emails
- OAuth credentials for Google and Microsoft

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── ...
├── components/            # React components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🚀 Deployment

The application is configured for deployment on Vercel. See `DEPLOYMENT.md` for detailed deployment instructions.

## 📖 Setup Guides

- [OAuth Setup](OAUTH-SETUP.md) - Configure Google and Microsoft OAuth
- [Stripe Setup](STRIPE-SETUP.md) - Set up payment processing
- [SendGrid Setup](SENDGRID-SETUP.md) - Configure email services
- [OpenAI Setup](OPENAI-SETUP.md) - Set up AI integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please refer to the setup guides or create an issue in the repository.
