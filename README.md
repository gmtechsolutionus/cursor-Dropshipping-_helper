# Dropshipping Helper - AI-Powered Product Analysis Tool

A production-ready Next.js web application that leverages the xAI API (Grok) to provide comprehensive dropshipping analysis including product identification, price comparison, supplier verification, and automated SEO description generation.

## Features

- **AI-Powered Image Analysis**: Upload product images for instant identification and analysis
- **Price Comparison**: Compare prices across multiple dropshipping platforms
- **Supplier Verification**: Verify supplier reliability with trust scores and red flag detection
- **Shipping Calculator**: Get shipping estimates with customs risk assessment
- **Review Analysis**: Analyze customer reviews with fake review detection
- **SEO Optimization**: Generate SEO-optimized product descriptions
- **Competitor Analysis**: Understand market positioning and opportunities
- **Export Functionality**: Export analysis results as PDF or CSV
- **Dark Mode**: Built-in dark mode support
- **Secure Authentication**: Google OAuth integration with NextAuth.js

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: xAI API (Grok)
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Export**: jsPDF, PapaParse
- **Deployment**: Optimized for Vercel Edge Runtime

## Prerequisites

- Node.js 18+ and npm
- xAI API key
- Google OAuth credentials (for authentication)
- Vercel account (for deployment)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dropshipping-helper
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```env
# xAI API Configuration
NEXT_PUBLIC_XAI_API_KEY=your_xai_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all variables from `.env.example`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── analyze-image/    # Main image analysis endpoint
│   │   ├── compare-prices/   # Price comparison endpoint
│   │   ├── verify-supplier/  # Supplier verification endpoint
│   │   ├── shipping/        # Shipping calculation endpoint
│   │   ├── reviews/         # Review analysis endpoint
│   │   ├── seo-desc/        # SEO description generation
│   │   ├── competitors/     # Competitor analysis endpoint
│   │   └── auth/           # NextAuth configuration
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── image-upload.tsx    # Drag-and-drop upload component
│   ├── product-analysis-display.tsx  # Analysis results display
│   ├── session-provider.tsx # Auth session provider
│   └── theme-provider.tsx   # Theme provider
├── lib/
│   ├── xai.ts              # xAI API integration
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
├── middleware.ts           # Auth middleware
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies and scripts
```

## API Routes

All API routes are optimized for Vercel Edge Runtime:

- `POST /api/analyze-image` - Analyze uploaded product images
- `POST /api/compare-prices` - Compare prices across platforms
- `POST /api/verify-supplier` - Verify supplier reliability
- `POST /api/shipping` - Calculate shipping estimates
- `POST /api/reviews` - Analyze product reviews
- `POST /api/seo-desc` - Generate SEO descriptions
- `POST /api/competitors` - Analyze competitors

## Security

- All API routes are protected with authentication
- xAI API key is stored securely as environment variable
- OAuth integration for secure user authentication
- Session management with NextAuth.js

## Performance Optimizations

- Edge Runtime for API routes
- Image optimization with Next.js Image component
- Lazy loading of analysis components
- Efficient data fetching with parallel API calls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.