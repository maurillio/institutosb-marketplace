import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebeautypro.vercel.app';
const SITE_NAME = 'The Beauty Pro';
const SITE_DESCRIPTION = 'O ecossistema digital definitivo para a indústria da beleza. Compre e venda produtos, cursos presenciais e online.';

export interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title,
  description = SITE_DESCRIPTION,
  image = `${SITE_URL}/og-image.jpg`,
  url,
  type = 'website',
  keywords = [],
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return {
    title: fullTitle,
    description,
    keywords: [
      'beleza',
      'marketplace',
      'cursos',
      'produtos',
      'maquiagem',
      'cabelo',
      'estética',
      'cosméticos',
      ...keywords,
    ],
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: fullUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'pt_BR',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@thebeautypro',
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateProductMetadata({
  name,
  description,
  price,
  images,
  category,
  seller,
}: {
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  seller?: string;
}): Metadata {
  const keywords = [
    name.toLowerCase(),
    category?.toLowerCase() || '',
    seller?.toLowerCase() || '',
    'comprar',
    'venda',
  ].filter(Boolean);

  const desc = description.length > 160 ? description.substring(0, 157) + '...' : description;

  return generateMetadata({
    title: name,
    description: desc,
    image: images[0] || undefined,
    type: 'product',
    keywords,
  });
}

export function generateCourseMetadata({
  title,
  description,
  imageUrl,
  instructor,
  category,
  level,
}: {
  title: string;
  description: string;
  imageUrl?: string;
  instructor?: string;
  category?: string;
  level?: string;
}): Metadata {
  const keywords = [
    title.toLowerCase(),
    'curso',
    'treinamento',
    category?.toLowerCase() || '',
    instructor?.toLowerCase() || '',
    level?.toLowerCase() || '',
  ].filter(Boolean);

  const instructorText = instructor || 'profissionais qualificados';
  const desc = description.length > 140 
    ? description.substring(0, 137) + '...'
    : description;
  const fullDesc = `${desc} Curso ministrado por ${instructorText}.`;

  return generateMetadata({
    title,
    description: fullDesc,
    image: imageUrl,
    type: 'article',
    keywords,
  });
}
