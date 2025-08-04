import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Cataloging Your Experiences",
  description: "Add and manage your concert, sports, and event experiences. Create your personal memory collection with detailed information and notes.",
  openGraph: {
    title: "Start Cataloging Your Experiences | Restub",
    description: "Add and manage your concert, sports, and event experiences. Create your personal memory collection with detailed information and notes.",
  },
  twitter: {
    title: "Start Cataloging Your Experiences | Restub",
    description: "Add and manage your concert, sports, and event experiences. Create your personal memory collection with detailed information and notes.",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}