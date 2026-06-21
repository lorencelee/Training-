import type { Metadata } from "next";
import "./globals.css";
import { TrainingProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "Personal OS",
  description: "Holistic personal tracking system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TrainingProvider>{children}</TrainingProvider>
      </body>
    </html>
  );
}
