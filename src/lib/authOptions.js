import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User.Model';
import { connectDB } from '@/config/connectDB';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credential: {
        email: { label: 'Email', value: 'text' },
        password: { label: 'Password', value: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and Password is missing.');
        }

        try {
          await connectDB();

          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error(`No user found with ${credentials.email}`);
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error('Invalid Password');
          }
          return {
            id: user._id.toString(),
            email: user.email,
            image: user.picture || '',
            name: user.name,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id.toString();
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 1 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
