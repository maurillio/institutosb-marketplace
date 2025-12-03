// Template base para todos os emails
export function getEmailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Beauty Pro</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f9fafb;
      color: #111827;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #db2777 0%, #c026d3 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 32px 24px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #db2777;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 16px 0;
    }
    .button:hover {
      background-color: #be185d;
    }
    .footer {
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #db2777;
      text-decoration: none;
    }
    h2 {
      color: #111827;
      font-size: 24px;
      margin-top: 0;
    }
    p {
      line-height: 1.6;
      color: #374151;
      margin: 16px 0;
    }
    .info-box {
      background-color: #f3f4f6;
      border-left: 4px solid #db2777;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .info-box strong {
      color: #111827;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>The Beauty Pro</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        <strong>The Beauty Pro</strong><br>
        O ecossistema digital definitivo para a indústria da beleza<br>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thebeautypro.vercel.app'}">Visitar site</a> |
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thebeautypro.vercel.app'}/ajuda">Central de Ajuda</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        Você está recebendo este email porque tem uma conta na The Beauty Pro.<br>
        Se você não reconhece esta atividade, entre em contato conosco imediatamente.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Helper para formatar moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Helper para formatar data
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(d);
}
