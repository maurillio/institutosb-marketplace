# Script SQL para criar categorias padrão no Neon PostgreSQL

## Instruções:
1. Acesse o dashboard do Neon: https://console.neon.tech/
2. Selecione o projeto do Beauty Pro
3. Vá em SQL Editor
4. Cole e execute o SQL abaixo:

```sql
-- Criar categorias padrão
INSERT INTO categories (id, name, slug, description, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Maquiagem', 'maquiagem', 'Produtos de maquiagem profissional e pessoal', NOW(), NOW()),
  (gen_random_uuid(), 'Cabelos', 'cabelos', 'Produtos para tratamento e cuidados capilares', NOW(), NOW()),
  (gen_random_uuid(), 'Pele', 'pele', 'Skincare e cuidados com a pele', NOW(), NOW()),
  (gen_random_uuid(), 'Unhas', 'unhas', 'Produtos para manicure e pedicure', NOW(), NOW()),
  (gen_random_uuid(), 'Perfumaria', 'perfumaria', 'Perfumes e fragrâncias', NOW(), NOW()),
  (gen_random_uuid(), 'Equipamentos', 'equipamentos', 'Equipamentos e ferramentas profissionais', NOW(), NOW()),
  (gen_random_uuid(), 'Acessórios', 'acessorios', 'Acessórios para profissionais de beleza', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
```

## Verificar se foram criadas:
```sql
SELECT * FROM categories ORDER BY name;
```
