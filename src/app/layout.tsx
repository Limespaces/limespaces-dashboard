import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const font_plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const font_outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const font_ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Limespaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        font_plusJakartaSans.variable,
        font_outfit.variable,
        font_ubuntuMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `window.NEXT_PUBLIC_ORCHESTRATOR_URL = ${JSON.stringify(
              process.env["NEXT_PUBLIC_ORCHESTRATOR_URL"] || "",
            )};`,
          }}
        />
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
