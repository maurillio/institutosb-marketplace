import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@thebeautypro/database';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            sellerProfile: true,
            instructorProfile: true,
          },
        });

        if (!user) {
          throw new Error('Credenciais inválidas');
        }

        if (user.status !== 'ACTIVE') {
          throw new Error('Sua conta está inativa. Entre em contato com o suporte.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas');
        }

        // Atualiza último login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          roles: user.roles,
          status: user.status,
        };
      },
    }),
  ],
  pages: {
    signIn: '/entrar',
    signOut: '/entrar',
    error: '/entrar',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // No login inicial
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar;
        token.roles = user.roles;
        token.status = user.status;
      }
      
      // Quando update() é chamado
      if (trigger === 'update' && token.id) {
        try {
          const updatedUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              roles: true,
              status: true,
              phone: true,
              cpfCnpj: true,
            },
          });
          
          if (updatedUser) {
            token.name = updatedUser.name;
            token.avatar = updatedUser.avatar;
            token.roles = updatedUser.roles;
            token.status = updatedUser.status;
            // Mantém id e email inalterados para não quebrar a sessão
          } else {
            console.error('Usuário não encontrado durante update:', token.id);
          }
        } catch (error) {
          console.error('Erro ao buscar usuário atualizado:', error);
          // Em caso de erro, mantém o token atual para não quebrar a sessão
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.avatar = token.avatar as string | null;
        session.user.roles = token.roles as string[];
        session.user.status = token.status as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
