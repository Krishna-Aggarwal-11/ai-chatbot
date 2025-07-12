import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../../db/drizzle'
import { users } from '../../../../../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }


    const hashedPassword = await bcrypt.hash(password, 12)

 
    const [newUser] = await db.insert(users).values({
      email,
      hashedPassword,
    }).returning()

    return NextResponse.json({
      message: 'User created successfully',
      user: { id: newUser.id, email: newUser.email },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}