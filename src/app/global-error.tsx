'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#fef3c7',
          fontFamily: 'Fredoka, Inter, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💥</div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '16px' 
            }}>
              Global Error Occurred
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#6b7280', 
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Something went wrong with the entire application. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#fbbf24',
                color: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fbbf24';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}


