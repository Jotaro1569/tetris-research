import { NextResponse } from 'next/server';
import { Reader } from '@maxmind/geoip2-node';
import path from 'path';
import fs from 'fs';

// Function to clean IP address
const cleanIpAddress = (ip: string): string => {
  // Remove IPv6 prefix for IPv4 addresses
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  // Check if it's a private/local IP
  const isPrivateIP = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(ip);
  
  if (isPrivateIP) {
    // For development/testing, you can set a default country here
    // or use a test IP from the country you want to simulate
    console.log('Local IP detected, using test IP');
    return '8.8.8.8'; // US IP for testing
    // You can change this to test different countries:
    // India: '103.48.71.0'
    // Indonesia: '103.28.56.0'
    // Netherlands: '145.53.53.0'
  }
  
  return ip;
};

// Function to get client IP address
const getClientIp = (request: Request): string => {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim();
    console.log('Raw x-forwarded-for IP:', ip);
    return cleanIpAddress(ip);
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    console.log('Raw x-real-ip:', realIp);
    return cleanIpAddress(realIp);
  }
  
  // Fallback to a default IP for development
  console.log('No IP found in headers, using fallback');
  return '8.8.8.8'; // Default to Google's DNS IP for testing
};

// Function to validate country code
const isValidCountryCode = (userCountry: string, selectedGroup: string): boolean => {
  const countryMapping: { [key: string]: string[] } = {
    'US': ['US'],
    'IN': ['IN'],
    'ID': ['ID'],
    'NL': ['NL']
  };

  const isValid = countryMapping[selectedGroup]?.includes(userCountry) || false;
  console.log('Country validation:', { userCountry, selectedGroup, isValid });
  return isValid;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selectedGroup } = body;
    console.log('Received request for group:', selectedGroup);
    
    if (!selectedGroup) {
      console.log('No group selected');
      return NextResponse.json({ error: 'Selected group is required' }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    console.log('Processed client IP:', clientIp);
    
    // Path to the MaxMind database
    const dbPath = path.join(process.cwd(), 'GeoLite2-Country.mmdb');
    console.log('Looking for database at:', dbPath);
    
    // Check if database exists
    if (!fs.existsSync(dbPath)) {
      console.log('Database file not found at:', dbPath);
      return NextResponse.json(
        { 
          error: 'Geolocation database not found', 
          allowed: false,
          dbPath: dbPath 
        },
        { status: 200 }
      );
    }

    console.log('Database file found, attempting to read...');
    const reader = await Reader.open(dbPath);
    
    try {
      const response = reader.country(clientIp);
      const userCountry = response.country?.isoCode;
      console.log('Detected user country:', userCountry);

      if (!userCountry) {
        console.log('Could not determine user country');
        return NextResponse.json({ 
          error: 'Could not determine location', 
          allowed: false,
          clientIp: clientIp
        }, { status: 200 });
      }

      const allowed = isValidCountryCode(userCountry, selectedGroup);

      const result = {
        allowed,
        userCountry,
        selectedGroup,
        message: allowed 
          ? 'Location verified successfully' 
          : `You can only participate in the study group for your country. Your location: ${userCountry}`
      };
      
      console.log('Final result:', result);
      return NextResponse.json(result, { status: 200 });
    } catch (lookupError) {
      console.error('Error looking up IP:', lookupError);
      // For development purposes, you might want to simulate a specific country
      const simulatedCountry = 'US'; // Change this to test different countries
      const allowed = isValidCountryCode(simulatedCountry, selectedGroup);
      
      return NextResponse.json({
        allowed,
        userCountry: simulatedCountry,
        selectedGroup,
        message: allowed 
          ? 'Location verified successfully (development mode)' 
          : `You can only participate in the study group for your country. Your location: ${simulatedCountry} (development mode)`
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Geolocation error:', error);
    return NextResponse.json(
      { 
        error: 'Error processing location', 
        allowed: false,
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    );
  }
} 