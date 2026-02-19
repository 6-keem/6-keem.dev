import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/footer/Footer';
import Sidebar from '@/components/nav/Sidebar';
import Main from '@/components/layout/Main';
import { Suspense } from 'react';
import Loading from '../loading';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Suspense fallback={<Loading />}>
          <Sidebar />
          <Main>{children}</Main>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
