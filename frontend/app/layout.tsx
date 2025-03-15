import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers';

export const metadata: Metadata = {
  title: 'LinkedIn Resume Tailor',
  description: 'Generate a tailored resume based on your LinkedIn profile and job posting',
  keywords: 'resume, tailoring, LinkedIn, job application, AI',
  authors: [{ name: 'Resume Tailor Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 