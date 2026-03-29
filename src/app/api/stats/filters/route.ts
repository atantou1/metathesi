import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [specialties, postingZones, divisions] = await Promise.all([
      prisma.specialty.findMany({
        select: {
          code: true,
          name: true,
          isPrimary: true,
          isSecondary: true,
          educationalCategory: true,
        },
        orderBy: { code: 'asc' },
      }),
      prisma.postingZone.findMany({
        select: { name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.division.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
    ])

    return NextResponse.json({
      specialties,
      postingZones: postingZones.map((z) => z.name),
      divisions,
    })
  } catch (error) {
    console.error('Error fetching filter data:', error)
    return NextResponse.json({ error: 'Failed to fetch filter data' }, { status: 500 })
  }
}
