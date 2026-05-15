import 'next-auth';

interface GitHubFollower {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      followers?: GitHubFollower[];
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    followers?: GitHubFollower[];
  }
}
