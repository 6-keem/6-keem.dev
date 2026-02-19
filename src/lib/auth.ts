import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
});

export const checkPermission = async (): Promise<boolean> => {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  return !!(session?.user?.email && adminEmail && session.user.email === adminEmail);
};
