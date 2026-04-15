import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const division = searchParams.get('division')
    const specialty = searchParams.get('specialty')

    if (!division || !specialty) {
      return NextResponse.json(
        { error: 'Missing division or specialty parameter' },
        { status: 400 }
      )
    }

    const analytics = await prisma.specialtyAnalytics.findUnique({
      where: {
        specialty_division: {
          specialty,
          division,
        },
      },
    })

    if (!analytics) {
      return NextResponse.json(
        { error: 'No analytics found for the given criteria' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: analytics })
  } catch (error) {
    console.error('Error fetching specialty analytics:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
