import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-orange-100/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
