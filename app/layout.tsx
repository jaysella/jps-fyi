import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata = {
  title: {
    default: "JPS",
    template: "%s | jps.fyi",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
