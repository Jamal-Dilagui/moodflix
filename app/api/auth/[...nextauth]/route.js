import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/models/User";
import { connectMongoDb } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectMongoDb();
          // Find user by email
          const user = await User.findOne({ email: credentials.email }).select('+password');
          if (!user) {
            throw new Error("No user found with this email");
          }
          // Compare passwords
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }
          // Return user object without password
          return {
            id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message);
        }
      }
    }),
   GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectMongoDb();
          
          // Check if user exists
          let dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            // Create new user for Google sign-in
            dbUser = new User({
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              password: 'google-auth-' + Math.random().toString(36).substring(2), // Dummy password
              googleId: user.id,
              isEmailVerified: true
            });
            await dbUser.save();
            console.log('✅ Created new user for Google sign-in:', dbUser._id);
          }
          
          // Update user ID for session
          user.id = dbUser._id.toString();
          return true;
        } catch (error) {
          console.error('Error in Google sign-in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Persist user data in token
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data to session
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 