import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Restub",
    template: "%s | Restub",
  },
  description:
    "Catalog, rank, and share your concert and sports event experiences with AI-powered insights. Import setlists, box scores, photos, and personal notes all in one beautiful place.",
  keywords: [
    "concerts",
    "events",
    "memories",
    "music",
    "sports",
    "catalog",
    "experiences",
    "setlists",
    "venues",
  ],
  authors: [{ name: "Restub Team" }],
  creator: "Restub",
  publisher: "Restub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://restub.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Restub - Never Lose Your Concert Memories Again",
    description:
      "Catalog, rank, and share your concert and sports event experiences with AI-powered insights.",
    url: "https://restub.app",
    siteName: "Restub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Restub - Concert Memory Keeper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restub - Never Lose Your Concert Memories Again",
    description:
      "Catalog, rank, and share your concert and sports event experiences with AI-powered insights.",
    creator: "@restub_app",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 px-4 relative transition-colors`}
      >
        {/* Enhanced background with gradient mesh and animated elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          {/* Base gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-orange-50/40 dark:from-purple-950/20 dark:via-blue-950/15 dark:to-orange-950/25"></div>
          
          {/* Animated floating orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-purple-500/30 dark:from-purple-400/20 dark:to-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-300/35 to-blue-500/25 dark:from-blue-400/15 dark:to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-orange-400/20 dark:from-orange-400/12 dark:to-orange-600/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Subtle geometric patterns */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-200/20 via-transparent to-blue-200/15 dark:from-purple-500/8 dark:to-blue-500/6 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-tr from-orange-300/25 via-transparent to-purple-300/20 dark:from-orange-500/10 dark:to-purple-500/8 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.008] bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
        </div>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
