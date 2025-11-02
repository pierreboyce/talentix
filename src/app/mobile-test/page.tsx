export default function MobileTest() {
  return (
    <div style={{
      backgroundColor: 'red',
      color: 'white',
      padding: '50px',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>🔴 MOBILE TEST PAGE 🔴</h1>
      <p>If you can see this, React is working!</p>
      <p>Screen width: {typeof window !== 'undefined' ? window.innerWidth : 'Loading...'}px</p>
      <p>User agent: {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'Loading...'}</p>
    </div>
  );
}











