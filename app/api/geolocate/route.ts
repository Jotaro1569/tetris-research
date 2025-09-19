import { NextResponse } from 'next/server';

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
      return NextResponse.json({ error: 'Selected group is required' }, { status: 400 });
    }

    // Use Vercel header to get country
    const clientCountry = request.headers.get('x-vercel-ip-country');
    console.log('x-vercel-ip-country header:', clientCountry);

    if (!clientCountry) {
      return NextResponse.json({
        allowed: false,
        message: 'Could not determine your location. Participation not allowed.'
      }, { status: 200 });
    }

    const allowed = isValidCountryCode(clientCountry, selectedGroup);

    return NextResponse.json({
      allowed,
      userCountry: clientCountry,
      selectedGroup,
      message: allowed 
        ? 'Location verified successfully' 
        : `You can only participate in the study group for your country. Your location: ${clientCountry}`
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing location:', error);
    return NextResponse.json({
      error: 'Error processing location',
      allowed: false,
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}
