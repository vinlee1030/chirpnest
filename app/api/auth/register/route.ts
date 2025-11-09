import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db';
import { isValidUserID } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userID, regKey, provider } = body;

    // Validate input
    if (!userID || !regKey || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidUserID(userID)) {
      return NextResponse.json(
        { error: 'Invalid userID format' },
        { status: 400 }
      );
    }

    if (!['google', 'github'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    // Validate registration key
    const validRegKey = process.env.REG_KEY || 'chirpnest2024';
    if (regKey.trim() !== validRegKey) {
      return NextResponse.json(
        { error: 'Invalid registration key' },
        { status: 401 }
      );
    }

    // Check if userID is already taken
    const db = await getDb();
    const usersCollection = db.collection(Collections.USERS);
    
    const existingUser = await usersCollection.findOne({ userID });
    if (existingUser) {
      return NextResponse.json(
        { error: 'UserID already taken' },
        { status: 409 }
      );
    }

    // Store pending registration (expires in 10 minutes)
    const pendingCollection = db.collection('pending_registrations');
    
    // Clean up old pending registrations
    await pendingCollection.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) }
    });

    // Store this pending registration
    const registrationToken = `${provider}_${userID}_${Date.now()}`;
    await pendingCollection.insertOne({
      token: registrationToken,
      userID,
      provider,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Return success with token
    return NextResponse.json({
      success: true,
      provider,
      userID,
      registrationToken,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    
    if (error.message?.includes('MONGODB_URI')) {
      errorMessage = 'Database connection not configured. Please check MONGODB_URI environment variable.';
    } else if (error.message?.includes('authentication failed')) {
      errorMessage = 'Database authentication failed. Please check your MongoDB credentials.';
    } else if (error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to database. Please check your MongoDB connection string and network settings.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

