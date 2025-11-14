#!/bin/bash
# Script executado automaticamente pelo Vercel durante o build
# Aplica as migrations no banco Neon

echo "🗄️ Aplicando migrations no banco de produção..."

cd packages/database

# Gera o Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate

# Aplica o schema no banco (não cria migrations, apenas sincroniza)
echo "🚀 Sincronizando schema com o banco..."
npx prisma db push --accept-data-loss --skip-generate

echo "✅ Migrations aplicadas com sucesso!"
