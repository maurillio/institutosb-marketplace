# Instruções para Popular o Banco de Dados

## Scripts SQL Criados

Foram criados 3 arquivos SQL com dados reais para popular o banco:

1. **seed.sql** - Usuários, perfis e categorias (156 linhas)
2. **seed-products.sql** - 50 produtos reais de beleza
3. **seed-courses.sql** - 10 cursos completos com módulos e aulas

## Como Executar no Neon

### 1. Acesse o Console do Neon
- Vá para https://console.neon.tech
- Selecione seu projeto (The Beauty Pro)
- Clique em "SQL Editor"

### 2. Execute os Scripts na Ordem

**IMPORTANTE: Execute na ordem correta!**

#### Passo 0: Criar Tabelas (PRIMEIRO!)
```sql
-- Copie e cole TODO o conteúdo de create-tables.sql
-- Execute (Ctrl+Enter ou botão Run)
-- Isso cria todas as tabelas necessárias
```

#### Passo 1: Usuários e Categorias
```sql
-- Copie e cole TODO o conteúdo de seed.sql
-- Execute (Ctrl+Enter ou botão Run)
```

#### Passo 2: Produtos
```sql
-- Copie e cole TODO o conteúdo de seed-products.sql
-- Execute (Ctrl+Enter ou botão Run)
```

#### Passo 3: Cursos
```sql
-- Copie e cole TODO o conteúdo de seed-courses.sql
-- Execute (Ctrl+Enter ou botão Run)
```

## Dados Criados

### Usuários
- **1 Admin**: admin@thebeautypro.com / senha123
- **10 Vendedores**: vendedor1@thebeautypro.com até vendedor10@thebeautypro.com / senha123
- **6 Instrutores**: instrutor1@thebeautypro.com até instrutor6@thebeautypro.com / senha123

### Estrutura
- **35 Categorias** (5 principais + 30 subcategorias)
- **50 Produtos Reais** distribuídos em:
  - 13 produtos de Maquiagem
  - 13 produtos de Cabelo
  - 11 produtos de Skincare
  - 9 produtos de Unhas
  - 4 produtos de Equipamentos

- **10 Cursos Completos**:
  1. Maquiagem Profissional (30h, R$ 497)
  2. Design de Sobrancelhas (15h, R$ 397)
  3. Colorimetria Capilar (20h, R$ 897)
  4. Skincare Profissional (12h, R$ 547)
  5. Nail Art Avançado (10h, R$ 447)
  6. Alongamento de Cílios (8h, R$ 697)
  7. Maquiagem Editorial (16h, R$ 1.497)
  8. Corte e Escova (40h, R$ 1.897)
  9. Marketing Digital (8h, R$ 297)
  10. Gestão de Salão (20h, R$ 697)

Cada curso possui módulos e aulas completos!

## Verificação

Após executar, você pode verificar no SQL Editor:

```sql
-- Contar registros
SELECT
  (SELECT COUNT(*) FROM "User") as usuarios,
  (SELECT COUNT(*) FROM "Category") as categorias,
  (SELECT COUNT(*) FROM "Product") as produtos,
  (SELECT COUNT(*) FROM "Course") as cursos,
  (SELECT COUNT(*) FROM "CourseModule") as modulos,
  (SELECT COUNT(*) FROM "CourseLesson") as aulas;
```

Resultado esperado:
- Usuários: 17
- Categorias: 35
- Produtos: 50
- Cursos: 10
- Módulos: ~40
- Aulas: ~80

## Problemas Comuns

### Erro de Foreign Key
Se aparecer erro de chave estrangeira, certifique-se de executar os scripts NA ORDEM.

### Erro de Duplicate Key
Se aparecer "duplicate key", significa que já existem dados. Execute primeiro:
```sql
DELETE FROM "CourseLesson";
DELETE FROM "CourseModule";
DELETE FROM "Product";
DELETE FROM "Course";
DELETE FROM "Category";
DELETE FROM "InstructorProfile";
DELETE FROM "SellerProfile";
DELETE FROM "User";
```

### Tabelas não encontradas
Se aparecer "table does not exist", execute primeiro o arquivo create-tables.sql no console Neon.

### Erro de tipo ENUM
Se aparecer erro relacionado a "UserRole", certifique-se de que o create-tables.sql foi executado primeiro, pois ele cria os tipos ENUM necessários.

## Próximos Passos

Após popular o banco, testar:
1. Login com admin@thebeautypro.com / senha123
2. Acessar /produtos - deve listar 50 produtos reais
3. Acessar /cursos - deve listar 10 cursos reais
4. Homepage deve mostrar produtos e cursos reais (não mockados)

## Observação

As imagens dos produtos e cursos ainda são placeholders (/images/products/..., /images/courses/...). Você pode:
1. Manter os placeholders por enquanto
2. Ou substituir posteriormente pelas imagens reais via Vercel Blob

O importante agora é que TODO O CONTEÚDO (nomes, descrições, preços, módulos, aulas) é REAL e não fictício!
