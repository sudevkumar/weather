"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import "./globals.css";
import AppStore from "../context/city";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <AppStore>
          <body className={inter.className}>{children}</body>
        </AppStore>
      </QueryClientProvider>
    </html>
  );
}
