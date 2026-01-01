import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Blog App',
  description: 'Next.js app with Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

