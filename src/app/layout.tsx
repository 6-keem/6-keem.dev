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
    <html
      lang="en"
      className="h-full scroll-my-20 scroll-smooth bg-secondary"
      style={{ overscrollBehaviorX: 'auto', overscrollBehaviorY: 'none' }}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen antialiased" style={{ overscrollBehaviorX: 'auto', overscrollBehaviorY: 'none' }}>
        <MyThemeProvider>
          <ScrollProvider>
            <SessionProvider>
              <Header />
              <Suspense fallback={<Loading />}>
                <main className="flex-1 min-h-screen pt-[64px] pb-[48px] relative">
                  {children}
                  <GlowBackground />
                </main>
              </Suspense>
              <Footer />
            </SessionProvider>
          </ScrollProvider>
        </MyThemeProvider>
      </body>
    </html>
  );
}
