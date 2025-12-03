const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebeautypro.vercel.app';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Beauty Pro',
    description: 'Marketplace de beleza com produtos e cursos',
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    sameAs: [
      'https://www.facebook.com/thebeautypro',
      'https://www.instagram.com/thebeautypro',
      'https://twitter.com/thebeautypro',
    ],
  };
}

export function generateProductSchema({
  id,
  name,
  description,
  price,
  images,
  category,
  seller,
  rating,
  reviewCount,
  inStock,
}: {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  seller?: { name: string; id: string };
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/produtos/${id}`,
    name,
    description,
    image: images,
    category: category || 'Beleza',
    brand: {
      '@type': 'Brand',
      name: seller?.name || 'The Beauty Pro',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/produtos/${id}`,
      priceCurrency: 'BRL',
      price: price.toFixed(2),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: seller?.name || 'The Beauty Pro',
      },
    },
    ...(rating &&
      reviewCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toFixed(1),
          reviewCount,
          bestRating: '5',
          worstRating: '1',
        },
      }),
  };
}

export function generateCourseSchema({
  id,
  title,
  description,
  imageUrl,
  instructor,
  price,
  level,
  rating,
  enrollmentCount,
}: {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  instructor?: { name: string; id: string };
  price?: number;
  level?: string;
  rating?: number;
  enrollmentCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${SITE_URL}/cursos/${id}`,
    name: title,
    description,
    ...(imageUrl && { image: imageUrl }),
    provider: {
      '@type': 'Organization',
      name: 'The Beauty Pro',
      url: SITE_URL,
    },
    ...(instructor && {
      instructor: {
        '@type': 'Person',
        name: instructor.name,
      },
    }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price.toFixed(2),
        priceCurrency: 'BRL',
      },
    }),
    ...(level && {
      educationalLevel: level,
    }),
    ...(rating &&
      enrollmentCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toFixed(1),
          reviewCount: enrollmentCount,
          bestRating: '5',
          worstRating: '1',
        },
      }),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Beauty Pro',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/produtos?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
