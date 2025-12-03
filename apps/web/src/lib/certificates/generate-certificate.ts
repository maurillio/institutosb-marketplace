import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  courseId: string;
  enrollmentId: string;
  duration?: number; // em horas
  certificateCode: string;
}

/**
 * Gera um certificado PDF para um curso concluído
 */
export function generateCertificate(data: CertificateData): Buffer {
  // Criar documento PDF em formato paisagem A4
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cores do tema
  const primaryColor = '#db2777'; // pink-600
  const secondaryColor = '#c026d3'; // purple-600

  // Adicionar borda decorativa
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(secondaryColor);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Logo/Título (The Beauty Pro)
  doc.setFontSize(32);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('The Beauty Pro', pageWidth / 2, 30, { align: 'center' });

  // Subtítulo
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificado de Conclusão', pageWidth / 2, 40, { align: 'center' });

  // Linha decorativa
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 43, pageWidth / 2 + 40, 43);

  // Texto principal
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificamos que', pageWidth / 2, 55, { align: 'center' });

  // Nome do aluno (destaque)
  doc.setFontSize(28);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(data.studentName, pageWidth / 2, 70, { align: 'center' });

  // Texto "concluiu com êxito"
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('concluiu com êxito o curso', pageWidth / 2, 82, { align: 'center' });

  // Nome do curso (destaque)
  doc.setFontSize(20);
  doc.setTextColor(secondaryColor);
  doc.setFont('helvetica', 'bold');

  // Quebrar o nome do curso em múltiplas linhas se necessário
  const courseNameLines = doc.splitTextToSize(data.courseName, pageWidth - 80);
  let courseNameY = 95;
  courseNameLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, courseNameY, { align: 'center' });
    courseNameY += 8;
  });

  // Informações adicionais
  const infoY = courseNameY + 10;
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');

  // Instrutor
  doc.text(
    `Ministrado por: ${data.instructorName}`,
    pageWidth / 2,
    infoY,
    { align: 'center' }
  );

  // Data de conclusão
  const formattedDate = data.completionDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(
    `Concluído em: ${formattedDate}`,
    pageWidth / 2,
    infoY + 8,
    { align: 'center' }
  );

  // Duração (se disponível)
  if (data.duration) {
    doc.text(
      `Carga horária: ${data.duration}h`,
      pageWidth / 2,
      infoY + 16,
      { align: 'center' }
    );
  }

  // Linha de assinatura
  const signatureY = pageHeight - 45;
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 40, signatureY, pageWidth / 2 + 40, signatureY);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('The Beauty Pro', pageWidth / 2, signatureY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.text('Plataforma de Educação em Beleza', pageWidth / 2, signatureY + 10, { align: 'center' });

  // Código de verificação (footer)
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Código de verificação: ${data.certificateCode}`,
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );

  doc.text(
    'Verifique a autenticidade deste certificado em thebeautypro.com/verificar',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Converter para Buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

/**
 * Gera código único para o certificado
 */
export function generateCertificateCode(enrollmentId: string, courseId: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const enrollmentPrefix = enrollmentId.substring(0, 6).toUpperCase();

  return `TBP-${enrollmentPrefix}-${timestamp}-${randomStr}`;
}
