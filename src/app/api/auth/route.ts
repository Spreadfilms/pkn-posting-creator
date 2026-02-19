import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'pkn_session'
const SESSION_VALUE = 'authenticated'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.PKN_PASSWORD || 'Sprite'

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true })
      response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      return response
    } else {
      return NextResponse.json({ success: false }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(SESSION_COOKIE)
  return response
}
