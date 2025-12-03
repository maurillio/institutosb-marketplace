import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
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
    async signIn({ user, account, profile }) {
      // Login via Google OAuth
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Verificar se usuário já existe
          let existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!existingUser) {
            // Criar novo usuário com dados do Google
            existingUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email.split('@')[0],
                avatar: (profile as any).picture || null,
                emailVerified: new Date(),
                password: '', // Sem senha para OAuth
                roles: ['CUSTOMER'],
                status: 'ACTIVE',
              },
            });
            console.log('[OAuth] Novo usuário criado:', existingUser.id);
          } else {
            // Atualizar último login
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { lastLoginAt: new Date() },
            });
            console.log('[OAuth] Usuário existente:', existingUser.id);
          }

          // Adicionar dados ao user object para o callback JWT
          user.id = existingUser.id;
          user.roles = existingUser.roles;
          user.status = existingUser.status;
          user.avatar = existingUser.avatar;

          return true;
        } catch (error) {
          console.error('[OAuth] Erro ao processar login Google:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      console.log('[JWT Callback] Trigger:', trigger, 'User ID:', token.id);
      
      // No login inicial
      if (user) {
        console.log('[JWT Callback] Login inicial - User:', user.id);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar;
        token.roles = user.roles;
        token.status = user.status;
      }
      
      // Quando update() é chamado
      if (trigger === 'update' && token.id) {
        console.log('[JWT Callback] Update triggered - Token ID:', token.id);
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
            console.log('[JWT Callback] Usuário encontrado:', {
              id: updatedUser.id,
              name: updatedUser.name,
              avatar: updatedUser.avatar,
            });
            token.name = updatedUser.name;
            token.avatar = updatedUser.avatar;
            token.roles = updatedUser.roles;
            token.status = updatedUser.status;
            // Mantém id e email inalterados para não quebrar a sessão
          } else {
            console.error('[JWT Callback] ❌ Usuário não encontrado durante update:', token.id);
          }
        } catch (error) {
          console.error('[JWT Callback] ❌ Erro ao buscar usuário atualizado:', error);
          // Em caso de erro, mantém o token atual para não quebrar a sessão
        }
      }
      
      console.log('[JWT Callback] Token final:', { id: token.id, name: token.name, email: token.email });
      return token;
    },
    async session({ session, token }) {
      console.log('[Session Callback] Token recebido:', { id: token.id, name: token.name });
      
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.avatar = token.avatar as string | null;
        session.user.roles = token.roles as string[];
        session.user.status = token.status as string;
      }
      
      console.log('[Session Callback] Session final:', { 
        userId: session.user?.id, 
        userName: session.user?.name 
      });
      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
