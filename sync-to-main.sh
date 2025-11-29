#!/bin/bash

# Script para sincronizar branch de desenvolvimento com main
# Uso: ./sync-to-main.sh

set -e  # Parar em caso de erro

CURRENT_BRANCH=$(git branch --show-current)
DEV_BRANCH="claude/beauty-pro-marketplace-setup-01MTUpYaZQTmpRkLc6v5oEi8"

echo "🔄 Sincronizando $DEV_BRANCH com main..."

# Certifica que estamos na branch de desenvolvimento
if [ "$CURRENT_BRANCH" != "$DEV_BRANCH" ]; then
    echo "⚠️  Trocando para branch $DEV_BRANCH"
    git checkout "$DEV_BRANCH"
fi

# Atualiza a branch de desenvolvimento
echo "📥 Atualizando branch de desenvolvimento..."
git pull origin "$DEV_BRANCH"

# Vai para main
echo "🔀 Trocando para main..."
git checkout main

# Atualiza main
echo "📥 Atualizando main..."
git pull origin main

# Faz merge
echo "🔗 Fazendo merge de $DEV_BRANCH → main..."
git merge "$DEV_BRANCH" -m "Merge: sync from development branch"

# Push para main
echo "📤 Enviando para origin/main..."
git push origin main

# Volta para branch de desenvolvimento
echo "↩️  Voltando para $DEV_BRANCH..."
git checkout "$DEV_BRANCH"

echo "✅ Sincronização concluída!"
echo "📍 Você está em: $(git branch --show-current)"
