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
| instrutor-001 | instrutor1@thebeautypro.com | Carla Mendes | password123 |
| instrutor-002 | instrutor2@thebeautypro.com | Roberto Silva | password123 |
| instrutor-003 | instrutor3@thebeautypro.com | Juliana Santos | password123 |
| instrutor-004 | instrutor4@thebeautypro.com | Fernando Costa | password123 |
| instrutor-005 | instrutor5@thebeautypro.com | Amanda Oliveira | password123 |
| instrutor-006 | instrutor6@thebeautypro.com | Paulo Ribeiro | password123 |

**Acesso:** `/dashboard/instrutor`

---

## 🏪 Vendedores (10 usuários)

| ID | Email | Nome | Senha |
|---|---|---|---|
| vendedor-001 | vendedor1@thebeautypro.com | Maria Silva | password123 |
| vendedor-002 | vendedor2@thebeautypro.com | João Santos | password123 |
| vendedor-003 | vendedor3@thebeautypro.com | Ana Costa | password123 |
| vendedor-004 | vendedor4@thebeautypro.com | Pedro Oliveira | password123 |
| vendedor-005 | vendedor5@thebeautypro.com | Juliana Souza | password123 |
| vendedor-006 | vendedor6@thebeautypro.com | Carlos Ferreira | password123 |
| vendedor-007 | vendedor7@thebeautypro.com | Fernanda Lima | password123 |
| vendedor-008 | vendedor8@thebeautypro.com | Ricardo Alves | password123 |
| vendedor-009 | vendedor9@thebeautypro.com | Patrícia Rocha | password123 |
| vendedor-010 | vendedor10@thebeautypro.com | Lucas Martins | password123 |

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
