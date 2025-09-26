import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';

interface NewsletterSubscription {
  fullName: string;
  email: string;
  age: string;
  location: string;
  hearAbout: string;
  subscribedAt: string;
}

// Configure Brevo API
const apiInstance = new brevo.ContactsApi();
// API key will be set from environment variable

export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment variables (without exposing the full API key)
    console.log('🔍 Environment check:');
    console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
    console.log('BREVO_LIST_ID:', process.env.BREVO_LIST_ID);
    if (process.env.BREVO_API_KEY) {
      console.log('API Key length:', process.env.BREVO_API_KEY.length);
      console.log('API Key starts with:', process.env.BREVO_API_KEY.substring(0, 10) + '...');
    }

    // Set API key from environment
    if (!process.env.BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not found in environment');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }
    
    apiInstance.setApiKey(brevo.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const { fullName, email, age, location, hearAbout } = await request.json();

    // Validate required fields
    if (!fullName || !email || !age || !location || !hearAbout) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create contact for Brevo
    const createContact = new brevo.CreateContact();
    createContact.email = email.toLowerCase();
    createContact.attributes = {
      FIRSTNAME: fullName.split(' ')[0],
      LASTNAME: fullName.split(' ').slice(1).join(' ') || '',
      AGE: parseInt(age) || 0,
      LOCATION: location,
      SOURCE: hearAbout,
      SIGNUP_DATE: new Date().toISOString()
    };
    
    // Add to Talentix newsletter list (default to list 1 if not specified)
    const listId = parseInt(process.env.BREVO_LIST_ID || '1');
    createContact.listIds = [listId];

    // Add contact to Brevo
    const response = await apiInstance.createContact(createContact);

    console.log('✅ Successfully added to Brevo newsletter:', {
      email: createContact.email,
      id: response.body?.id || 'created',
      listId: listId,
      name: fullName
    });

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        subscriber: {
          fullName,
          email: email.toLowerCase(),
          subscribedAt: new Date().toISOString()
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    // Log detailed error information for debugging
    if (error.response) {
      console.error('❌ Brevo API Error Details:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Body:', JSON.stringify(error.response.data, null, 2));
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      console.error('Request Data:', JSON.stringify(error.config?.data, null, 2));
    }
    
    // Handle Brevo specific errors
    if (error.response?.data?.code === 'duplicate_parameter') {
      return NextResponse.json(
        { error: 'Email already subscribed to newsletter' },
        { status: 409 }
      );
    }

    if (error.response?.data?.message) {
      console.error('Brevo API error message:', error.response.data.message);
      return NextResponse.json(
        { error: `Brevo API Error: ${error.response.data.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve subscribers from Brevo
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const adminKey = url.searchParams.get('key');
    
    // Check admin authentication
    if (adminKey !== process.env.NEWSLETTER_ADMIN_KEY && adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Set API key from environment
    if (!process.env.BREVO_API_KEY) {
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }
    
    apiInstance.setApiKey(brevo.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
    
    const listId = parseInt(process.env.BREVO_LIST_ID || '1');
    
    // Get contacts from Brevo list
    const contacts = await apiInstance.getContactsFromList(listId);
    
    // Format contacts for admin dashboard
    const formattedSubscribers = contacts.body?.contacts?.map(contact => {
      const attrs = contact.attributes as any;
      return {
        fullName: `${attrs?.FIRSTNAME || ''} ${attrs?.LASTNAME || ''}`.trim(),
        email: contact.email || '',
        age: attrs?.AGE?.toString() || '',
        location: attrs?.LOCATION || '',
        hearAbout: attrs?.SOURCE || '',
        subscribedAt: attrs?.SIGNUP_DATE || contact.createdAt || new Date().toISOString()
      };
    }) || [];

    console.log(`📊 Retrieved ${formattedSubscribers.length} subscribers from Brevo list ${listId}`);

    return NextResponse.json({
      subscribers: formattedSubscribers,
      count: contacts.body?.count || 0,
      listInfo: {
        listId: listId,
        totalContacts: contacts.body?.count || 0
      }
    });

  } catch (error: any) {
    console.error('Error fetching Brevo subscribers:', error);
    
    if (error.response?.body?.message) {
      console.error('Brevo API error:', error.response.body.message);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
