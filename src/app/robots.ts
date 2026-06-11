import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', // Закрываем от поисковиков внутренний кабинет
        '/api/',       // Закрываем системные API
      ],
    },
    sitemap: 'https://kammerjaeger-structon.de/sitemap.xml',
  }
}
