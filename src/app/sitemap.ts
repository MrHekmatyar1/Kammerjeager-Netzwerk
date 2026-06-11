import type { MetadataRoute } from 'next'
import { CITIES } from '@/lib/data/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kammerjaeger-structon.de'

  // Основные статические страницы сайта
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0, // Главная страница - высший приоритет
    },
    {
      url: `${baseUrl}/geschaeftskunden`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8, // Страница для бизнеса тоже очень важна
    },
    {
      url: `${baseUrl}/fuer-schaedlingsbekaempfer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7, // Привлечение партнеров
    },
    {
      url: `${baseUrl}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3, // Юридические страницы имеют низкий приоритет для SEO
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/agb`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Динамические страницы для каждого города
  const cityPages = CITIES.map(city => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // Городские страницы имеют высочайший приоритет для локального SEO!
  }))

  return [...staticPages, ...cityPages]
}
