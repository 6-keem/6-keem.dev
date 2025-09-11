import './globals.css';
import MyThemeProvider from '@/components/provider/ThemeProvider';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/footer/Footer';
import { ScrollProvider } from '@/components/provider/ScrollProvider';
import { GlowBackground } from '@/components/GlowBackground';
import { Metadata } from 'next';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { Suspense } from 'react';
import Loading from './loading';
import { SessionProvider } from 'next-auth/react';
import { SidebarProvider } from '@/components/provider/SidebarProvider';
import Main from '@/components/layout/Main';
import { TocProvider } from '@/components/provider/TocProvider';
import Sidebar from '@/components/nav/Sidebar';

export async function generateMetadata(): Promise<Metadata> {
  const title = blogName;
  const url = baseDomain;
  const thumbnailURL = blogThumbnailURL;

  return {
    title,
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
                  <Header />
                  <Suspense fallback={<Loading />}>
                    <Sidebar />
                    <Main>{children}</Main>
                  </Suspense>
                  <Footer />
                </SidebarProvider>
              </SessionProvider>
            </ScrollProvider>
          </TocProvider>
        </MyThemeProvider>
      </body>
    </html>
  );
}
