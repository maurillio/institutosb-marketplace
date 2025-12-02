# Credenciais de Acesso - The Beauty Pro

## 🔑 Senha Padrão para Todos os Usuários

**Senha:** `password123`

**Hash bcrypt:** `$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW`

---

## 👑 Administrador

**Email:** `admin@thebeautypro.com`
**Senha:** `password123`
**Roles:** ADMIN, SELLER, INSTRUCTOR
**ID:** `admin-001`

---

## 👨‍🏫 Instrutores (6 usuários)

| ID | Email | Nome | Senha |
|---|---|---|---|
| instrutor-001 | instrutor-001@thebeautypro.com | Carolina Lima | password123 |
| instrutor-002 | instrutor-002@thebeautypro.com | Roberto Silva | password123 |
| instrutor-003 | instrutor-003@thebeautypro.com | Juliana Santos | password123 |
| instrutor-004 | instrutor-004@thebeautypro.com | Fernando Costa | password123 |
| instrutor-005 | instrutor-005@thebeautypro.com | Patrícia Alves | password123 |
| instrutor-006 | instrutor-006@thebeautypro.com | Ricardo Mendes | password123 |

**Acesso:** `/dashboard/instrutor`

---

## 🏪 Vendedores (10 usuários)

| ID | Email | Nome | Senha |
|---|---|---|---|
| seller-001 | seller-001@thebeautypro.com | Maria Silva | password123 |
| seller-002 | seller-002@thebeautypro.com | João Santos | password123 |
| seller-003 | seller-003@thebeautypro.com | Ana Costa | password123 |
| seller-004 | seller-004@thebeautypro.com | Pedro Oliveira | password123 |
| seller-005 | seller-005@thebeautypro.com | Juliana Rodrigues | password123 |
| seller-006 | seller-006@thebeautypro.com | Carlos Ferreira | password123 |
| seller-007 | seller-007@thebeautypro.com | Beatriz Almeida | password123 |
| seller-008 | seller-008@thebeautypro.com | Lucas Pereira | password123 |
| seller-009 | seller-009@thebeautypro.com | Camila Souza | password123 |
| seller-010 | seller-010@thebeautypro.com | Rafael Lima | password123 |

**Acesso:** `/dashboard/vendedor`

---

## 🔍 Verificar no Banco

Execute no console Neon:

```sql
-- Listar todos os usuários
SELECT id, email, name, roles, status
FROM "users"
ORDER BY
  CASE
    WHEN 'ADMIN' = ANY(roles) THEN 1
    WHEN 'INSTRUCTOR' = ANY(roles) THEN 2
    WHEN 'SELLER' = ANY(roles) THEN 3
    ELSE 4
  END,
  email;
```

---

## 📝 Notas

- Todos os usuários têm status `ACTIVE`
- Todos os emails estão verificados (`emailVerified` = NOW())
- A senha pode ser trocada após o primeiro login
- Para criar novos usuários, use a mesma senha hasheada ou crie novos hashes
