'use client';

export default function NotFound() {
  return (
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
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '16px' 
        }}>
          Page Not Found
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6b7280', 
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          The page you're looking for doesn't exist. Let's get you back on track!
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="home-button"
          style={{
            display: 'inline-block',
            backgroundColor: '#fbbf24',
            color: '#1f2937',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none'
          }}
        >
          🏠 Go Home
        </button>
      </div>
      
      <style jsx>{`
        .home-button:hover {
          background-color: #f59e0b !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
    </div>
  )
}
