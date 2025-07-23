import type { Metadata } from "next";
import { Fira_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartMCQ – Adaptive MCQ Platform for Colleges",
  description:
    "SmartMCQ transforms MCQ testing into adaptive learning. Built for colleges, it provides real-time analytics, anti-cheating, and mastery-based progress to help students truly understand concepts.",
  keywords: [
    "SmartMCQ",
    "adaptive learning",
    "MCQ platform",
    "online quiz",
    "student performance analytics",
    "anti-cheating quiz system",
    "concept mastery",
    "college quiz platform",
    "learning insights",
    "MCQ analytics",
    "SmartMCQ demo",
  ],
  metadataBase: new URL("https://quiz.meikuraledutech.in"),
  authors: [{ name: "Meikura Edutech", url: "https://meikuraledutech.in" }],
  creator: "Meikura Edutech",
  publisher: "Meikura Edutech",
  openGraph: {
    title: "SmartMCQ – Adaptive MCQ Platform for Colleges",
    description:
      "SmartMCQ is a cutting-edge MCQ platform that adapts to student performance. Get real-time analytics, adaptive learning paths, and in-depth insights built for academic excellence.",
    url: "https://quiz.meikuraledutech.in",
    siteName: "SmartMCQ",
    type: "website",
    images: [
      {
        url: "https://quiz.meikuraledutech.in/og-image.png", // update with actual OG image
        width: 1200,
        height: 630,
        alt: "SmartMCQ – Adaptive Learning Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartMCQ – Adaptive MCQ Platform for Colleges",
    description:
      "Transform MCQ testing into meaningful learning with SmartMCQ. Built for colleges, with real-time analytics and adaptive feedback.",
    images: ["https://quiz.meikuraledutech.in/og-image.png"], // update with actual OG image
    creator: "@meikuraedutech", // optional: update if you have a handle
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${firaSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
