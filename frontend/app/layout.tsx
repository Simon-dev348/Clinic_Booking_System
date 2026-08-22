import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carewise | Clinic booking",
  description: "Book care across your clinic network.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
