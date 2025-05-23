
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aizen',
  description: 'AI assistant with a samurai personality. Developed by Atiyab.',
  authors: [{ name: 'Atiyab' }],
  icons: {
    icon: 'https://media-hosting.imagekit.io/6c8a2b9fabc44330/icon.png?Expires=1841544283&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=cZhCSJ6JmG7qJ9x1AFK9DTgYq6E0YcFJQ~gWhdqAEDJNePyuvt8g9x8-mqr3eMvXaD-yt9F~d2Y80YnZfOHirlSgFJGwy3dkyq3arxDwXYCFE1ooJMIocybnEmYS6y4q0jcZBalo-Z~iwRd-nnyYQ2046iqrI37VlauSwWOkb4X6otPS0J~30qIFfpw9AabJpt-Fphvf8GeUf8OxsLrcxU6RvQ1j1whUNXzKdq-EOm8~4aj4HM0ttLVgy6czdAccNEyccyYO7Wfc00LYpXukE96ZII2LxqpCvryk~tNk6EgjKbO6rcN-0-rJ1JdjcysdjGzd53GqIW3RS9XLDbATIw__',
    apple: 'https://media-hosting.imagekit.io/6c8a2b9fabc44330/icon.png?Expires=1841544283&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=cZhCSJ6JmG7qJ9x1AFK9DTgYq6E0YcFJQ~gWhdqAEDJNePyuvt8g9x8-mqr3eMvXaD-yt9F~d2Y80YnZfOHirlSgFJGwy3dkyq3arxDwXYCFE1ooJMIocybnEmYS6y4q0jcZBalo-Z~iwRd-nnyYQ2046iqrI37VlauSwWOkb4X6otPS0J~30qIFfpw9AabJpt-Fphvf8GeUf8OxsLrcxU6RvQ1j1whUNXzKdq-EOm8~4aj4HM0ttLVgy6czdAccNEyccyYO7Wfc00LYpXukE96ZII2LxqpCvryk~tNk6EgjKbO6rcN-0-rJ1JdjcysdjGzd53GqIW3RS9XLDbATIw__',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Force dark theme by adding 'dark' className to <html>
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
