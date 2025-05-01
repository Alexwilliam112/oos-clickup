import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClient from "./query-client";
import { SidebarNav } from "@/components/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { metadata } from "@/metadata"; // Import metadata

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title> {/* Use metadata */}
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClient>
          <SidebarProvider>
            {/* Sidebar */}
            <SidebarNav />

            {/* Main Content */}
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </QueryClient>
      </body>
    </html>
  );
}
