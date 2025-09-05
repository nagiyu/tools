import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Freshness Notifier',
    short_name: 'Freshness Notifier',
    description: 'Freshness Notifier',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.png',
        sizes: '400x400',
        type: 'image/png'
      }
    ],
  }
}
