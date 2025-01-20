import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@auth0/nextjs-auth0/client";
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
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
