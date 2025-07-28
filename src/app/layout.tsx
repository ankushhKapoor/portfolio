import "./globals.css";
import { getUrl } from "@/utilities/getUrl";
import { Geist_Mono, Geist } from "next/font/google";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"

type Props = {
  children: React.ReactNode;
};

const GeistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="q462Bi-qAx4ZBjIAJmk8RGPwMAAnXk3-Z7eMaTL8GHY" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-geist-sans bg-white overscroll-none dark:bg-zinc-900">
        <ThemeProvider defaultTheme="system" storageKey="ahmet-theme">
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
};

export default RootLayout;

export const viewport: Viewport = {
  themeColor: "#ffffff",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getUrl),
  title: {
    default: "Ankush Kapoor - Computer Engineering Student",
    template: `%s - Ankush Kapoor - Computer Engineering Student",`,
  },
  description: "I'm Ankush Kapoor, a Computer Engineering student and systems programmer based in India. I’m passionate about low-level software, operating systems, and developer tooling. I build projects like virtual machines, memory allocators, custom Linux utilities, and contribute to open-source frameworks. I enjoy exploring how computers work under the hood and creating tools that empower developers. Ankush Kapoor portfolio.",
  keywords: ["Ankush Kapoor", "Portfolio", "Computer Engineering", "India", "Developer"],
  openGraph: {
    title: "Ankush Kapoor - Computer Engineering Student",
    description: "I'm Ankush Kapoor, a Computer Engineering student and systems programmer based in India. I’m passionate about low-level software, operating systems, and developer tooling. I build projects like virtual machines, memory allocators, custom Linux utilities, and contribute to open-source frameworks. I enjoy exploring how computers work under the hood and creating tools that empower developers. Ankush Kapoor portfolio.",
    url: "https://ankushhkapoor.vercel.app",
    siteName: "Ankush Kapoor Portfolio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 600,
        alt: "Ankush Kapoor Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankush Kapoor - Computer Engineering Student",
    description: "I'm Ankush Kapoor, a Computer Engineering student and systems programmer based in India. I’m passionate about low-level software, operating systems, and developer tooling. I build projects like virtual machines, memory allocators, custom Linux utilities, and contribute to open-source frameworks. I enjoy exploring how computers work under the hood and creating tools that empower developers. Ankush Kapoor portfolio.",
    images: ["/opengraph-image.png"],
  },
};
