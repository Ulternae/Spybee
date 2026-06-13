import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.scss";

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Spybee",
  description: "Project and map-based incident management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserratAlternates.variable}>
      <body>{children}</body>
    </html>
  );
}
