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
    default: "Restub - Your Sports Memory Keeper",
    template: "%s | Restub",
  },
  description:
    "Never forget an incredible game experience. Log the sports games you attend, build your stadium collection, and preserve your memories with AI-powered game detection.",
  keywords: [
    "sports",
    "games",
    "stadium",
    "memories",
    "baseball",
    "football",
    "basketball",
    "hockey",
    "soccer",
    "game tracker",
    "sports collection",
    "stadium experiences",
    "sports memories",
    "game log",
  ],
  authors: [{ name: "Restub" }],
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
    title: "Restub - Your Sports Memory Keeper",
    description:
      "Never forget an incredible game experience. Log sports games, build your stadium collection, and preserve memories forever.",
    url: "https://restub.app",
    siteName: "Restub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Restub - Sports Memory Keeper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restub - Your Sports Memory Keeper",
    description:
      "Never forget an incredible game. Log sports games, build your stadium collection, and preserve memories forever.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
