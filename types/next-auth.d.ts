import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userID: string;
      name: string;
      displayName: string;
      email?: string;
      image?: string;
      avatarUrl: string;
    };
  }

  interface User {
    id: string;
    userID: string;
    name: string;
    displayName: string;
    avatarUrl: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    userID?: string;
    displayName?: string;
    avatarUrl?: string;
  }
}

