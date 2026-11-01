const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const sector = await prisma.sector.upsert({
    where: { name: 'Hospitality' },
    update: {},
    create: { name: 'Hospitality', description: 'Hotels, restaurants, events' },
  });

  const company1 = await prisma.company.upsert({
    where: { id: 'seed-company-1' },
    update: {},
    create: {
      id: 'seed-company-1',
      name: 'Grand Hotel Manchester',
      industry: 'Hospitality',
      address: '1 Deansgate, Manchester M3 2EN',
      contactPerson: 'Sarah Mitchell',
      contactNumber: '0161 123 4567',
      email: 'hr@grandhotel.co.uk',
    },
  });

  await prisma.company.upsert({
    where: { id: 'seed-company-2' },
    update: {},
    create: {
      id: 'seed-company-2',
      name: 'Peak Logistics',
      industry: 'Logistics',
      address: 'Unit 4, Trafford Park, Manchester M17 1WA',
      contactPerson: 'James Wright',
      contactNumber: '0161 987 6543',
      email: 'ops@peaklogistics.co.uk',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@primestaff.co.uk' },
    update: {},
    create: {
      email: 'admin@primestaff.co.uk',
      password,
      role: 'SUPER_ADMIN',
      isVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'employer@grandhotel.co.uk' },
    update: {},
    create: {
      email: 'employer@grandhotel.co.uk',
      password,
      role: 'EMPLOYER',
      isVerified: true,
      companyId: company1.id,
    },
  });

  const workers = [
    { email: 'jordan@example.com', firstName: 'Jordan', lastName: 'Clarke', niNumber: 'AB123456C', position: 'Lead Waiter' },
    { email: 'amelie@example.com', firstName: 'Amelie', lastName: 'Laurent', niNumber: 'CD234567D', position: 'Events Staff' },
    { email: 'marcus@example.com', firstName: 'Marcus', lastName: 'Braid', niNumber: 'EF345678E', position: 'Warehouse Operative' },
  ];

  for (const worker of workers) {
    const user = await prisma.user.upsert({
      where: { email: worker.email },
      update: {},
      create: {
        email: worker.email,
        password,
        role: 'EMPLOYEE',
        isVerified: true,
      },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: { position: worker.position },
      create: {
        userId: user.id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        dob: new Date('1995-06-15'),
        gender: 'Other',
        niNumber: worker.niNumber,
        phone: '07700 900123',
        address: '42 Oxford Road',
        postcode: 'M1 5QA',
        city: 'Manchester',
        country: 'UK',
        emergencyContact: 'Jane Clarke',
        emergencyPhone: '07700 900456',
        relationship: 'Spouse',
        bankAccountName: `${worker.firstName} ${worker.lastName}`,
        bankSortCode: '12-34-56',
        bankAccountNumber: '12345678',
        rtwStatus: 'Verified',
        position: worker.position,
        sectors: { connect: { id: sector.id } },
      },
    });
  }

  await prisma.job.upsert({
    where: { id: 'seed-job-1' },
    update: {},
    create: {
      id: 'seed-job-1',
      title: 'Waitstaff - Evening Shift',
      description: 'Serving guests at corporate events',
      requirements: 'Food hygiene certificate',
      payRate: 14.0,
      location: 'Grand Hotel Manchester',
      workersNeeded: 5,
      sectorId: sector.id,
      companyId: company1.id,
    },
  });

  console.log('Seed complete. Login with password123');
  console.log('Admin:', admin.email);
  console.log('Worker: jordan@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
