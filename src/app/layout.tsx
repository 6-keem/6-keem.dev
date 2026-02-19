import './globals.css';
import MyThemeProvider from '@/components/provider/ThemeProvider';
import { Metadata } from 'next';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { SessionProvider } from 'next-auth/react';
import { SidebarProvider } from '@/components/provider/SidebarProvider';
import { TocProvider } from '@/components/provider/TocProvider';
import { ScrollProvider } from '@/components/provider/ScrollProvider';

import { Toaster as SonnerToaster } from 'sonner';

export async function generateMetadata(): Promise<Metadata> {
  const title = blogName;
  const url = baseDomain;
  const thumbnailURL = blogThumbnailURL;

  return {
    title,
    openGraph: { title, url, images: [thumbnailURL] },
    twitter: { title, images: [thumbnailURL] },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-background" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <MyThemeProvider>
          <TocProvider>
            <ScrollProvider>
              <SessionProvider>
                <SidebarProvider>{children}</SidebarProvider>
                <SonnerToaster richColors position="top-center" />
              </SessionProvider>
            </ScrollProvider>
          </TocProvider>
        </MyThemeProvider>
      </body>
    </html>
  );
}
