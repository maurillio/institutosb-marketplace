# Como Visualizar Logs no Vercel

## Acesso aos Logs

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: **thebeautypro**
3. Clique na aba **"Logs"** ou **"Runtime Logs"**

## Logs Implementados

Todos os logs seguem o formato: `[Componente] ação - detalhes`

### 1. Frontend (Console do Navegador)
Abra o DevTools (F12) e veja:
```
[Frontend] ========== INÍCIO ATUALIZAÇÃO ==========
[Frontend] Dados a enviar: {...}
[Frontend] Enviando requisição PATCH...
[Frontend] Response status: 200
[Frontend] ✅ Perfil atualizado
[Frontend] Chamando update() do NextAuth...
[Frontend] Update result: {...}
[Frontend] Recarregando página em 1 segundo...
```

### 2. API de Perfil (Vercel Logs)
```
[Profile API] ========== INÍCIO PATCH ==========
[Profile API] Session: User ID: xxx
[Profile API] Dados recebidos: {...}
[Profile API] Atualizando usuário: xxx
[Profile API] ✅ Usuário atualizado: {...}
```

### 3. NextAuth JWT Callback (Vercel Logs)
```
[JWT Callback] Trigger: update, User ID: xxx
[JWT Callback] Update triggered - Token ID: xxx
[JWT Callback] Usuário encontrado: {...}
[JWT Callback] Token final: {...}
```

### 4. NextAuth Session Callback (Vercel Logs)
```
[Session Callback] Token recebido: {...}
[Session Callback] Session final: {...}
```

### 5. Middleware (Vercel Logs)
```
[Middleware] Path: /perfil, Token exists: true
[Middleware] User: xxx - Nome do Usuário
[Middleware] ✅ Acesso permitido
```

## Como Debugar o Problema

### Passo 1: Teste a Atualização
1. Faça login
2. Vá em `/perfil`
3. Atualize algum campo
4. Clique em "Salvar Alterações"
5. **Abra o Console do Navegador (F12)** antes de clicar

### Passo 2: Analise os Logs no Vercel
1. Acesse os Runtime Logs no Vercel
2. Filtre por "Profile API" ou "JWT Callback"
3. Procure por:
   - ❌ Erros em vermelho
   - `❌ ERRO CRÍTICO`
   - `❌ Usuário não encontrado`
   - Status 401 ou 500

### Passo 3: Identifique o Problema
Possíveis causas:

#### A) Erro na API de Perfil
```
[Profile API] ❌ ERRO CRÍTICO: ...
```
→ Problema ao salvar no banco

#### B) Token não atualizado
```
[JWT Callback] ❌ Usuário não encontrado durante update
```
→ Problema ao buscar usuário após update

#### C) Sessão invalidada
```
[Middleware] Token exists: false
```
→ Token foi perdido/invalidado

## Erros Conhecidos e Soluções

### Erro: "Não autenticado" após update
**Sintoma**: Redireciona para /entrar após salvar perfil
**Causa**: Token foi invalidado durante update
**Logs esperados**:
```
[JWT Callback] ❌ Usuário não encontrado
```

### Erro: Dados não salvam
**Sintoma**: Após reload, dados voltam ao estado anterior
**Causa**: Falha no PATCH da API
**Logs esperados**:
```
[Profile API] ❌ ERRO CRÍTICO
```

## Próximos Passos

Após testar e coletar os logs:

1. **Copie TODOS os logs** do console do navegador
2. **Copie os logs relevantes** do Vercel Runtime Logs
3. **Envie junto com**:
   - Hora exata do teste
   - Que dados você tentou atualizar
   - O que aconteceu (logout? dados não salvaram?)

Isso vai nos permitir identificar **exatamente onde** o problema está ocorrendo! 🔍
