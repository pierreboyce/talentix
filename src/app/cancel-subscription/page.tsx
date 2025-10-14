'use client';

import { useState } from 'react';

export default function CancelSubscription() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!email) {
      setMessage('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/simple-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Found subscription for ${data.customerEmail}! Redirecting to Stripe...`);
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      } else {
        setMessage(`❌ ${data.error}`);
        if (data.details) {
          setMessage(prev => prev + ` (${data.details})`);
        }
      }
    } catch (error) {
      console.error('Portal error:', error);
      setMessage('❌ Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '900',
          fontFamily: 'Fredoka, sans-serif',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          Cancel Subscription
        </h1>
        
        <p style={{
          fontSize: '16px',
          fontFamily: 'Fredoka, sans-serif',
          color: '#6b7280',
          marginBottom: '32px'
        }}>
          Enter your email address to access your Stripe billing portal and manage your subscription.
        </p>

        <form onSubmit={handleCancel} style={{ marginBottom: '20px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontFamily: 'Fredoka, sans-serif',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              marginBottom: '20px',
              outline: 'none'
            }}
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              fontFamily: 'Fredoka, sans-serif',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Finding Subscription...' : '🔗 Access Stripe Portal'}
          </button>
        </form>

        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: message.includes('error') || message.includes('Failed') ? '#fee2e2' : '#d1fae5',
            color: message.includes('error') || message.includes('Failed') ? '#dc2626' : '#059669',
            fontSize: '14px',
            fontFamily: 'Fredoka, sans-serif'
          }}>
            {message}
          </div>
        )}

        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          fontSize: '14px',
          fontFamily: 'Fredoka, sans-serif',
          color: '#6b7280'
        }}>
          <strong>Note:</strong> This will redirect you to Stripe's secure billing portal where you can cancel your subscription, update payment methods, and download invoices.
        </div>

        <a 
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            color: '#6366f1',
            textDecoration: 'none',
            fontSize: '14px',
            fontFamily: 'Fredoka, sans-serif'
          }}
        >
          ← Back to Talentix
        </a>
      </div>
    </div>
  );
}
