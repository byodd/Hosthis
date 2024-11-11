// imports
import NextAuth, { User, DefaultSession } from "next-auth";

import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string; 
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;  
    }
}

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    callbacks: {
        jwt({ token, user, profile }) {
            if (user) token.user = user;
            if (profile) token.profile = profile;
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user = {
                    ...session.user,
                    id: token.sub as string,  
                    username: (token.profile as any).login,  
                };
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
