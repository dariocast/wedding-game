import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    tableId: string;
    tableName: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      tableId: string;
      tableName: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string;
    tableId?: string;
    tableName?: string;
  }
}
