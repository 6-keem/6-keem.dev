'use client';

import { Home, LogOut, Pencil, SquarePen } from 'lucide-react';
import Dock from '../Dock';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface DockSectionProps {
  postId: number | null;
}
export default function DockSection({ postId }: Partial<DockSectionProps>) {
  const router = useRouter();
  const pathname = usePathname();

  const isBlogDetail = /^\/blog\/[^/]+\/[^/]+$/.test(pathname);

  const items = isBlogDetail
    ? [
        { icon: <Home size={18} />, label: 'Home', onClick: () => router.push('/'), className: 'rounded-xl' },
        { icon: <Pencil size={18} />, label: 'Edit', onClick: () => router.push(`/write?id=${postId}`), className: 'rounded-xl' },
        {
          icon: <LogOut size={18} />,
          label: 'Logout',
          onClick: async () => signOut({ callbackUrl: '/' }),
          className: 'rounded-xl text-red-500 hover:text-red-600',
        },
      ]
    : [
        { icon: <Home size={18} />, label: 'Home', onClick: () => router.push('/'), className: 'rounded-xl' },
        { icon: <SquarePen size={18} />, label: 'Write', onClick: () => router.push('/write'), className: 'rounded-xl' },
        {
          icon: <LogOut size={18} />,
          label: 'Logout',
          onClick: async () => signOut({ callbackUrl: '/' }),
          className: 'rounded-xl text-red-500 hover:text-red-600',
        },
      ];

  return <Dock items={items} panelHeight={68} baseItemSize={50} magnification={70} />;
}
