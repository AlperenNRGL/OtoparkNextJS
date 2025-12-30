/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Development mode optimizasyonları - CSS optimizasyonu development'ta yavaşlatabilir
  // experimental: {
  //   optimizeCss: true, // Production'da kullan, development'ta kapalı
  // },
}

module.exports = nextConfig

