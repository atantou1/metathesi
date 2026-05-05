import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const stats = await prisma.transferStatistics.findFirst({
    where: {
      region: "ΛΑΡΙΣΑΣ",
      division: "Πρωτοβάθμια Γενικής",
      specialty: "ΠΕ70"
    }
  })
  console.dir(stats, { depth: null })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
