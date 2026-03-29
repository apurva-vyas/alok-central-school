import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    console.error('Example:');
    console.error('  ADMIN_EMAIL=admin@example.com');
    console.error('  ADMIN_PASSWORD=YourSecurePassword');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const oldAdmins = await prisma.adminUser.findMany();
  if (oldAdmins.length > 0) {
    await prisma.adminUser.deleteMany();
    console.log(`Removed ${oldAdmins.length} old admin user(s).`);
  }

  const user = await prisma.adminUser.create({
    data: { email, password: hashedPassword, name },
  });

  console.log(`Admin user created successfully!`);
  console.log(`  Email:    ${user.email}`);
  console.log(`  Name:     ${name}`);
  console.log(`  Password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
