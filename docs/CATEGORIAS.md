# Gerenciamento de Categorias

## Visão Geral
As categorias são gerenciadas em nível de administração do sistema. Usuários finais (vendedores) podem apenas selecionar categorias existentes ao criar produtos.

## Criar Categorias Manualmente

Para criar categorias no banco de dados, use o Prisma Studio ou execute SQL diretamente:

### Opção 1: Via Prisma Studio
```bash
npx prisma studio
```

### Opção 2: Via SQL (PostgreSQL)
```sql
INSERT INTO categories (id, name, slug, description, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Maquiagem', 'maquiagem', 'Produtos de maquiagem profissional e pessoal', NOW(), NOW()),
  (gen_random_uuid(), 'Cabelos', 'cabelos', 'Produtos para tratamento e cuidados capilares', NOW(), NOW()),
  (gen_random_uuid(), 'Pele', 'pele', 'Skincare e cuidados com a pele', NOW(), NOW()),
  (gen_random_uuid(), 'Unhas', 'unhas', 'Produtos para manicure e pedicure', NOW(), NOW()),
  (gen_random_uuid(), 'Perfumaria', 'perfumaria', 'Perfumes e fragrâncias', NOW(), NOW()),
  (gen_random_uuid(), 'Equipamentos', 'equipamentos', 'Equipamentos e ferramentas profissionais', NOW(), NOW()),
  (gen_random_uuid(), 'Acessórios', 'acessorios', 'Acessórios para profissionais de beleza', NOW(), NOW());
```

### Opção 3: Via Vercel Postgres Dashboard
1. Acesse o dashboard do Vercel
2. Vá em Storage > Postgres
3. Execute o SQL acima no Query editor

## API Endpoints

### Listar todas as categorias (para selects)
```
GET /api/categories?all=true
```

### Listar categorias raiz
```
GET /api/categories
```

## Categorias Padrão Sugeridas

- **Maquiagem**: Bases, pós, batons, sombras, etc.
- **Cabelos**: Shampoos, condicionadores, tratamentos, coloração
- **Pele**: Hidratantes, protetores solares, sérums, limpeza facial
- **Unhas**: Esmaltes, removedores, fortalecedores, acessórios
- **Perfumaria**: Perfumes, colônias, desodorantes
- **Equipamentos**: Secadores, chapinhas, máquinas de corte
- **Acessórios**: Pincéis, esponjas, necessaires, organizadores

## TODO: Interface Admin
- [ ] Criar página `/admin/categorias` para gerenciar categorias
- [ ] Implementar CRUD completo
- [ ] Adicionar upload de imagens para categorias
- [ ] Suporte para subcategorias
