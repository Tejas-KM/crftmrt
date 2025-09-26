import NextAuth, { type NextAuthOptions, type Session, type User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // Correct type for NextAuthOptions
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (session?.user) {
        (session.user as any).id = token.sub;
        session.user.email = token.email;
      }
      // Expose the JWT token to the client for API calls
      (session as any).token = token?.__raw ?? token?.accessToken ?? token?.jti ?? token;
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Always redirect to home after sign in/up
      return baseUrl;
    },
  },
  events: {
    async createUser({ user }) {
      // Always ensure cart and wishlist fields exist for new users (or existing)
      const client = await clientPromise;
      const db = client.db();
      await db.collection("users").updateOne(
        { email: user.email },
        {
          $set: {
            cart: { items: [], total: 0, itemCount: 0 },
            wishlist: { items: [] },
          },
        },
        { upsert: true }
      );
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
