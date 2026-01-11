import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'test+marmotz@marmotz.dev' },
    update: {},
    create: {
      email: 'test+marmotz@marmotz.dev',
      name: 'Marmotz',
      password: passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'test+stella@marmotz.dev' },
    update: {},
    create: {
      email: 'test+stella@marmotz.dev',
      name: 'Stella',
      password: passwordHash,
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
