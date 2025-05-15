# Detectly - Medical Image Analysis Platform

Detectly is a modern web application that provides automated detection and analysis of various medical conditions using Groq Vision model. Built with Next.js 15, React 19, and TypeScript, it offers a beautiful and intuitive interface for medical image analysis.

## Features

- **Multiple Disease Detection**
  - Alzheimer's Disease Analysis
  - Brain Tumor Detection
  - Diabetic Retinopathy Screening
  - Heart Disease Risk Assessment
- **AI-Powered Analysis**: Utilizes Groq Vision model for accurate detection
- **Medical Consultation**: Includes AI-generated medical explanations and recommendations
- **Modern UI/UX**: Beautiful interface built with Tailwind CSS and Radix UI
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Mode**: Customizable theme preferences
- **Real-time Updates**: Instant analysis results and notifications
- **Secure File Storage**: AWS S3 integration for medical image storage

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Charts:** Recharts
- **Storage:** AWS S3
- **Date Handling:** date-fns
- **Notifications:** Sonner
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)
- AWS S3 credentials (for file storage)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd detectly
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following content:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_bucket_name
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code linting

## Project Structure

```
detectly/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   └── dashboard/   # Dashboard and main application routes
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── public/          # Static assets
└── styles/          # Global styles and Tailwind configurations
```

## Features in Detail

### Medical Image Analysis
- Upload and analyze medical images (MRI, X-rays, retina scans)
- Real-time processing with progress indicators
- Detailed analysis reports with confidence scores
- AI-generated medical explanations

### User Interface
- Intuitive dashboard for managing analyses
- Interactive charts and visualizations
- Responsive design for all screen sizes
- Accessible components following WCAG guidelines

### Security
- Secure file upload and storage
- Protected API routes
- Environment variable management
- AWS S3 integration for secure file storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Disclaimer

This application is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 