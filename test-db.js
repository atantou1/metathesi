const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const attempts = await prisma.loginAttempt.findMany();
  console.log("Login Attempts:");
  console.log(attempts);
}
main().catch(console.error).finally(() => prisma.$disconnect());
