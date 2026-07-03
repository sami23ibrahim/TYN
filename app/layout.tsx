import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

/*
  Poppins is the closest free match to the export's geometric-humanist sans.
  // TODO: swap for the real brand typeface once supplied.
*/
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TÝN — Premium Levantine Catering",
  description:
    "Premium catering crafted with a touch of Middle Eastern heritage. Thoughtfully designed menus, seasonal ingredients, and memorable experiences for weddings, private celebrations and corporate events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
