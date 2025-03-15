import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LinkedIn Resume Tailor',
  description: 'Generate tailored resumes and interview preparation materials based on your LinkedIn profile and job descriptions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </body>
    </html>
  );
} 