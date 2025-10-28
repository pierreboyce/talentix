import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return JavaScript code that will clear all storage
    const clearScript = `
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage  
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      console.log('✅ All storage cleared');
      
      // Redirect to home page
      window.location.href = '/';
    `;
    
    return new Response(clearScript, {
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  } catch (error) {
    console.error('❌ Error creating clear script:', error);
    return NextResponse.json({ 
      error: 'Failed to create clear script' 
    }, { status: 500 });
  }
}









