import './globals.css';
import MyThemeProvider from '@/components/provider/ThemeProvider';
import { ScrollProvider } from '@/components/provider/ScrollProvider';
import { Metadata } from 'next';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { SessionProvider } from 'next-auth/react';
import { SidebarProvider } from '@/components/provider/SidebarProvider';
import { TocProvider } from '@/components/provider/TocProvider';
import ScrollTopOnNavFlag from '@/components/common/ScrollTopOnNavFlag';
import { Toaster as SonnerToaster } from 'sonner';

export async function generateMetadata(): Promise<Metadata> {
  const title = blogName;
  const url = baseDomain;
  const thumbnailURL = blogThumbnailURL;

  return {
    title,
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    },
    openGraph: {
      title,
      url,
      images: [thumbnailURL],
    },
    twitter: {
      title,
      images: [thumbnailURL],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-my-20 scroll-smooth bg-background" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen antialiased">
        <MyThemeProvider>
          <TocProvider>
            <ScrollProvider>
              <SessionProvider>
                <SidebarProvider>
                  <ScrollTopOnNavFlag />
                  {children}
                </SidebarProvider>
                <SonnerToaster richColors position="top-center" />
              </SessionProvider>
            </ScrollProvider>
          </TocProvider>
        </MyThemeProvider>
      </body>
    </html>
  );
}
