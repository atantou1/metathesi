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

    const statistics = await prisma.transferStatistics.findMany({
      where: {
        division,
        specialty,
      },
    })

    return NextResponse.json({ statistics })
  } catch (error) {
    console.error('Error fetching map data:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
