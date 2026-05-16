import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/header";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={cn("font-sans", geist.variable)} >
      <body>
        <Header/>
        {children}
        </body>
    </html>
  )
}
