import WriteClient from '@/components/write/WriteClient';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

type PageProps = {
  searchParams?: Promise<{ id?: string }>;
};
export default async function WritePage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) notFound();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) notFound();
  if (session.user.email !== adminEmail) notFound();

  const sp = await searchParams;
  const postId = sp?.id?.trim() ?? null;

  return (
    <main className="w-full">
      <WriteClient postId={postId ?? null} />
    </main>
  );
}
