# 💳 Configuração Mercado Pago - The Beauty Pro

## 📋 Pré-requisitos

1. Conta Mercado Pago ativa
2. Aplicação criada no painel de desenvolvedor
3. Credenciais de produção ativadas

---

## 🔑 Passo 1: Obter Credenciais

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Selecione sua aplicação
3. Vá em **Credenciais** > **Credenciais de produção**
4. Copie:
   - **Public Key** (`pk_live_...`)
   - **Access Token** (`APP_USR_...`)

---

## 📦 Passo 2: Criar Planos de Assinatura

### Opção A: Via Painel Web
1. Acesse: https://www.mercadopago.com.br/subscriptions/plans
2. Crie 3 planos com os seguintes valores:

#### Plano Basic
- **Nome:** Beauty Pro Basic
- **Valor:** R$ 29,90
- **Frequência:** Mensal
- **Descrição:** Plano básico para vendedores iniciantes

#### Plano Pro
- **Nome:** Beauty Pro Profissional
- **Valor:** R$ 79,90
- **Frequência:** Mensal
- **Descrição:** Plano profissional com recursos avançados

#### Plano Premium
- **Nome:** Beauty Pro Premium
- **Valor:** R$ 199,90
- **Frequência:** Mensal
- **Descrição:** Plano premium com todos os recursos

3. Copie o **Plan ID** de cada plano criado

### Opção B: Via API (Avançado)
```bash
curl -X POST \
  'https://api.mercadopago.com/preapproval_plan' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "reason": "Beauty Pro Basic",
    "auto_recurring": {
      "frequency": 1,
      "frequency_type": "months",
      "transaction_amount": 29.90,
      "currency_id": "BRL"
    },
    "back_url": "https://thebeautypro.vercel.app/dashboard/vendedor"
  }'
```

---

## 🔔 Passo 3: Configurar Webhook

1. No painel do Mercado Pago, vá em **Webhooks**
2. Clique em **Adicionar Webhook**
3. Configure:
   - **URL:** `https://thebeautypro.vercel.app/api/webhooks/mercadopago/subscription`
   - **Eventos:**
     - ✅ `subscription` (Assinaturas)
     - ✅ `subscription_preapproval` (Pré-aprovação)
     - ✅ `subscription_authorized_payment` (Pagamento autorizado)
4. Salve o webhook

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### No arquivo `.env.local`:
```env
# Mercado Pago - Produção
MERCADO_PAGO_PUBLIC_KEY=pk_live_seu_public_key_aqui
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_seu_access_token_aqui

# IDs dos Planos de Assinatura
MP_PLAN_BASIC=plan_id_basic_aqui
MP_PLAN_PRO=plan_id_pro_aqui
MP_PLAN_PREMIUM=plan_id_premium_aqui

# URL do Webhook (já configurado)
MERCADO_PAGO_WEBHOOK_URL=https://thebeautypro.vercel.app/api/webhooks/mercadopago/subscription
```

### No Vercel:
```bash
# Adicionar via CLI
vercel env add MERCADO_PAGO_PUBLIC_KEY production
vercel env add MERCADO_PAGO_ACCESS_TOKEN production
vercel env add MP_PLAN_BASIC production
vercel env add MP_PLAN_PRO production
vercel env add MP_PLAN_PREMIUM production

# Ou via Dashboard do Vercel:
# Settings > Environment Variables > Add
```

---

## 🧪 Passo 5: Testar Integração

### Teste Local (Desenvolvimento):
1. Use as **credenciais de teste** do Mercado Pago
2. Cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

### Teste em Produção:
1. Acesse: https://thebeautypro.vercel.app/plans
2. Escolha um plano
3. Complete o pagamento
4. Verifique:
   - Dashboard do vendedor atualizado
   - Email de confirmação recebido
   - Webhook recebido (logs do Vercel)

---

## 📊 Fluxo de Assinatura

```
1. Usuário escolhe plano
   ↓
2. Cria preapproval no Mercado Pago
   ↓
3. Redireciona para checkout MP
   ↓
4. Usuário autoriza pagamento recorrente
   ↓
5. MP envia notificação ao webhook
   ↓
6. Webhook atualiza plano no banco
   ↓
7. Usuário redirecionado ao dashboard
```

---

## 🔍 Monitoramento

### Logs do Webhook:
```bash
# Ver logs no Vercel
vercel logs --follow

# Buscar por:
[MP Webhook Subscription]
```

### Verificar Assinaturas Ativas:
```sql
SELECT
  u.email,
  sp.plan,
  sp.subscription_status,
  sp.subscription_ends_at
FROM seller_profiles sp
JOIN users u ON sp.user_id = u.id
WHERE sp.subscription_status = 'ACTIVE'
ORDER BY sp.subscription_ends_at;
```

---

## ⚠️ Troubleshooting

### Webhook não está sendo chamado
1. Verifique URL no painel MP
2. Confirme que eventos estão marcados
3. Teste com Postman/curl

### Assinatura não atualiza
1. Verifique logs do webhook
2. Confirme `external_reference` = `userId`
3. Verifique credenciais de produção

### Pagamento recusado
1. Use cartão de teste válido
2. Verifique saldo em teste
3. Confirme credenciais corretas

---

## 📚 Documentação Oficial

- [Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/subscriptions)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/webhooks)
- [Teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing)
- [Cartões de Teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing/test-cards)

---

## ✅ Checklist Final

- [ ] Credenciais de produção obtidas
- [ ] 3 planos criados no MP
- [ ] Webhook configurado e ativo
- [ ] Variáveis de ambiente no Vercel
- [ ] Teste realizado com sucesso
- [ ] Email de confirmação funcionando
- [ ] Dashboard atualizando corretamente

---

**🎉 Pronto! Pagamentos recorrentes configurados!**
