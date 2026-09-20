import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ClientProvider from "@/provider/cleint-provider";
import PwaRegister from "@/components/pwa-register";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "ByteBondi",
    template: "%s | ByteBondi",
  },

  description:
    "A simple, secure platform to store, manage, and share your files.",

  applicationName: "ByteBondi",

  manifest: "/manifest.json",

  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: "/apple-icon.png",
  },

  metadataBase: new URL("https://your-domain.com"),

  openGraph: {
    title: "ByteBondi",
    description:
      "A simple, secure platform to store, manage, and share your files.",
    siteName: "ByteBondi",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ByteBondi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ByteBondi",
    description:
      "A simple, secure platform to store, manage, and share your files.",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.className, "font-sans")}
    >
      <body className="">
        <PwaRegister />
        <ClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ClientProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
