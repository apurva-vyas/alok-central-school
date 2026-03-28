import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@alokcentralschool.com';
  const password = 'ACS@admin2026';
  const name = 'Admin';

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.create({
    data: { email, password: hashedPassword, name },
  });

  console.log(`Admin user created successfully!`);
  console.log(`  Email:    ${user.email}`);
  console.log(`  Password: ${password}`);
  console.log(`  CHANGE THIS PASSWORD after first login!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
