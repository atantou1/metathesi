import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding test users...')

  const passwordHash = await bcrypt.hash('password123', 10)

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      fullName: 'Admin User',
      passwordHash: passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })
  console.log('Created Admin:', admin.email)

  // Create Standard User 1
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@test.com' },
    update: {},
    create: {
      email: 'user1@test.com',
      fullName: 'Test User 1',
      passwordHash: passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })
  console.log('Created User 1:', user1.email)

  // Create Standard User 2
  const user2 = await prisma.user.upsert({
    where: { email: 'user2@test.com' },
    update: {},
    create: {
      email: 'user2@test.com',
      fullName: 'Test User 2',
      passwordHash: passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })
  console.log('Created User 2:', user2.email)

  // Create Standard User 3
  const user3 = await prisma.user.upsert({
    where: { email: 'user3@test.com' },
    update: {},
    create: {
      email: 'user3@test.com',
      fullName: 'Test User 3',
      passwordHash: passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })
  console.log('Created User 3:', user3.email)

  // Create Standard User 4
  const user4 = await prisma.user.upsert({
    where: { email: 'user4@test.com' },
    update: {},
    create: {
      email: 'user4@test.com',
      fullName: 'Test User 4',
      passwordHash: passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })
  console.log('Created User 4:', user4.email)

  // Create Standard User 5
  const user5 = await prisma.user.upsert({
    where: { email: 'user5@test.com' },
    update: {},
    create: {
      email: 'user5@test.com',
      fullName: 'Test User 5',
      passwordHash: passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })
  console.log('Created User 5:', user5.email)

  // Optional: Create Profiles for these users if needed
  // We need valid specialtyId, divisionId, currentZoneId
  const specialty = await prisma.specialty.findFirst()
  const division = await prisma.division.findFirst()
  const zone = await prisma.postingZone.findFirst()

  if (specialty && division && zone) {
    const users = [user1, user2, user3, user4, user5]
    for (const user of users) {
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          specialtyId: specialty.id,
          divisionId: division.id,
          currentZoneId: zone.id,
          fullName: user.fullName,
        },
      })
      console.log(`Created Profile for ${user.email}`)
    }
  } else {
    console.warn('Could not create profiles: missing specialty, division or zone in database.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
