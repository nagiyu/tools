import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SNP',
    short_name: 'Sample Next.js Project',
    description: 'Sample Next.js Project',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/ponzu.png',
        sizes: '400x400',
        type: 'image/png'
      }
    ],
  }
}