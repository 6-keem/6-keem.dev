import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {
                    scope: "read:user user:follow user:email",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account?.access_token) {
                const followersRes = await fetch("https://api.github.com/user/followers", {
                    headers: { Authorization: `Bearer ${account.access_token}` },
                });
                const followers = await followersRes.json();

                token.followers = followers;
            }
            return token;
        },

        async session({ session, token }) {
            if (token.followers) {
                session.user.followers = token.followers as any[];
            }
            return session;
        },
    },
});
