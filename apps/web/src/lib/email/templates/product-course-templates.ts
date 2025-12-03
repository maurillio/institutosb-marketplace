import { getEmailLayout } from './base';

interface ProductApprovedParams {
  userName: string;
  productName: string;
  productUrl: string;
  dashboardUrl: string;
}

export function productApprovedEmail(params: ProductApprovedParams): string {
  const content = `
    <h2>Produto Aprovado! 🎉</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      Temos ótimas notícias! Seu produto <strong>${params.productName}</strong> foi aprovado
      e já está disponível para venda na plataforma.
    </p>

    <div class="info-box">
      ✅ Seu produto está visível para todos os compradores<br>
      📈 Comece a promover para aumentar suas vendas<br>
      💰 Receba pagamentos automaticamente a cada venda
    </div>

    <p style="margin-top: 24px;">
      <strong>Próximos passos:</strong>
    </p>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Compartilhe o link do produto nas suas redes sociais</li>
      <li>Responda rapidamente às perguntas dos interessados</li>
      <li>Mantenha seu estoque atualizado</li>
    </ul>

    <a href="${params.productUrl}" class="button">Ver Produto</a>
    <a href="${params.dashboardUrl}" class="button" style="background-color: #6b7280; margin-left: 8px;">
      Ir para Dashboard
    </a>

    <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
      Continue cadastrando mais produtos para aumentar suas vendas!
    </p>
  `;

  return getEmailLayout(content);
}

interface ProductRejectedParams {
  userName: string;
  productName: string;
  reason: string;
  dashboardUrl: string;
}

export function productRejectedEmail(params: ProductRejectedParams): string {
  const content = `
    <h2>Produto Precisa de Ajustes ⚠️</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      Seu produto <strong>${params.productName}</strong> foi analisado e precisa de alguns ajustes
      antes de ser publicado.
    </p>

    <div class="info-box" style="border-left-color: #f59e0b;">
      <strong>Motivo:</strong><br>
      ${params.reason}
    </div>

    <p style="margin-top: 24px;">
      <strong>O que fazer agora:</strong>
    </p>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Acesse seu dashboard e edite o produto</li>
      <li>Faça as correções necessárias</li>
      <li>Reenvie para análise</li>
    </ul>

    <a href="${params.dashboardUrl}" class="button">Editar Produto</a>

    <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
      Estamos aqui para ajudar! Se tiver dúvidas, entre em contato conosco.
    </p>
  `;

  return getEmailLayout(content);
}

interface CourseApprovedParams {
  userName: string;
  courseTitle: string;
  courseUrl: string;
  dashboardUrl: string;
}

export function courseApprovedEmail(params: CourseApprovedParams): string {
  const content = `
    <h2>Curso Aprovado! 🎓</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      Parabéns! Seu curso <strong>${params.courseTitle}</strong> foi aprovado
      e já está disponível para matrículas.
    </p>

    <div class="info-box">
      ✅ Curso publicado e visível na plataforma<br>
      👥 Alunos já podem se matricular<br>
      💡 Comece a compartilhar para atrair mais estudantes
    </div>

    <p style="margin-top: 24px;">
      <strong>Dicas para o sucesso do seu curso:</strong>
    </p>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Divulgue o curso nas suas redes sociais</li>
      <li>Responda rapidamente as dúvidas dos alunos</li>
      <li>Mantenha o conteúdo sempre atualizado</li>
      <li>Incentive os alunos a deixarem avaliações</li>
    </ul>

    <a href="${params.courseUrl}" class="button">Ver Curso</a>
    <a href="${params.dashboardUrl}" class="button" style="background-color: #6b7280; margin-left: 8px;">
      Ir para Dashboard
    </a>

    <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
      Boas aulas e muito sucesso com seu curso!
    </p>
  `;

  return getEmailLayout(content);
}

interface CourseRejectedParams {
  userName: string;
  courseTitle: string;
  reason: string;
  dashboardUrl: string;
}

export function courseRejectedEmail(params: CourseRejectedParams): string {
  const content = `
    <h2>Curso Precisa de Ajustes ⚠️</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      Seu curso <strong>${params.courseTitle}</strong> foi analisado e precisa de alguns ajustes
      antes de ser publicado.
    </p>

    <div class="info-box" style="border-left-color: #f59e0b;">
      <strong>Motivo:</strong><br>
      ${params.reason}
    </div>

    <p style="margin-top: 24px;">
      <strong>O que fazer agora:</strong>
    </p>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Acesse seu dashboard de instrutor</li>
      <li>Edite o curso e faça as correções necessárias</li>
      <li>Reenvie para análise</li>
    </ul>

    <a href="${params.dashboardUrl}" class="button">Editar Curso</a>

    <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
      Estamos aqui para ajudar! Se tiver dúvidas, entre em contato conosco.
    </p>
  `;

  return getEmailLayout(content);
}

interface EnrollmentConfirmationParams {
  userName: string;
  courseTitle: string;
  courseUrl: string;
  instructorName: string;
}

export function enrollmentConfirmationEmail(params: EnrollmentConfirmationParams): string {
  const content = `
    <h2>Matrícula Confirmada! 🎓</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      Sua matrícula no curso <strong>${params.courseTitle}</strong> foi confirmada com sucesso!
    </p>

    <div class="info-box">
      👨‍🏫 <strong>Instrutor:</strong> ${params.instructorName}<br>
      📚 <strong>Acesso:</strong> Imediato e vitalício<br>
      📱 <strong>Disponível em:</strong> Todos os dispositivos
    </div>

    <p style="margin-top: 24px;">
      <strong>Comece seus estudos agora:</strong>
    </p>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Acesse o conteúdo completo do curso</li>
      <li>Assista as aulas no seu ritmo</li>
      <li>Acompanhe seu progresso</li>
      <li>Obtenha seu certificado ao concluir</li>
    </ul>

    <a href="${params.courseUrl}" class="button">Começar Curso Agora</a>

    <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
      Bons estudos e muito sucesso na sua jornada de aprendizado!
    </p>
  `;

  return getEmailLayout(content);
}

interface CourseCompletedParams {
  userName: string;
  courseTitle: string;
  completionDate: Date;
  certificateUrl: string;
}

export function courseCompletedEmail(params: CourseCompletedParams): string {
  const content = `
    <h2>Parabéns! Você Concluiu o Curso! 🎉</h2>
    <p>Olá <strong>${params.userName}</strong>,</p>
    <p>
      É com grande satisfação que informamos que você completou 100% do curso
      <strong>${params.courseTitle}</strong>!
    </p>

    <div class="info-box">
      🎓 <strong>Conclusão:</strong> ${new Date(params.completionDate).toLocaleDateString('pt-BR')}<br>
      ✨ <strong>Progresso:</strong> 100% completo<br>
      📜 <strong>Certificado:</strong> Disponível para download
    </div>

    <p style="margin-top: 24px;">
      Seu certificado de conclusão está pronto e pode ser baixado a qualquer momento.
      Compartilhe sua conquista nas redes sociais e adicione ao seu currículo!
    </p>

    <a href="${params.certificateUrl}" class="button">Baixar Certificado</a>

    <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">
      Continue aprendendo! Confira outros cursos disponíveis na plataforma.
    </p>
  `;

  return getEmailLayout(content);
}
