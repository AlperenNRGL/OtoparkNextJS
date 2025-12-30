export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Blog App - Next.js + Supabase</h1>
      <p>API Endpoints:</p>
      <ul>
        <li>POST /api/veri-ekle - Veri ekleme</li>
        <li>GET /api/veri-getir - Tüm verileri getirme</li>
        <li>POST /api/veri-getir - Plaka ile veri getirme</li>
      </ul>
    </main>
  )
}

