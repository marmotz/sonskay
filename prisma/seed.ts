import 'dotenv/config';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function main() {
  const password = '123456789';

  // User 1: Marmotz
  try {
    await auth.api.signUpEmail({
      body: {
        email: 'test+marmotz@marmotz.dev',
        password: password,
        name: 'Marmotz',
      },
    });
    console.log('✓ Created user: test+marmotz@marmotz.dev');
  } catch (error) {
    if (error instanceof Error && error.message?.includes('already exists')) {
      console.log('⚠ User already exists: test+marmotz@marmotz.dev');
    } else {
      throw error;
    }
  }

  // User 2: Stella
  try {
    await auth.api.signUpEmail({
      body: {
        email: 'test+stella@marmotz.dev',
        password: password,
        name: 'Stella',
      },
    });
    console.log('✓ Created user: test+stella@marmotz.dev');
  } catch (error) {
    if (error instanceof Error && error.message?.includes('already exists')) {
      console.log('⚠ User already exists: test+stella@marmotz.dev');
    } else {
      throw error;
    }
  }

  console.log('\nSeed completed successfully');
  console.log('Users available:');
  console.log('  - test+marmotz@marmotz.dev (password: 123456789)');
  console.log('  - test+stella@marmotz.dev (password: 123456789)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
