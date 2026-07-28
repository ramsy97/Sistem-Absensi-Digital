import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const office = await prisma.office.create({
    data: {
      name: "HQ Main Office",
      latitude: -6.2088,
      longitude: 106.8456,
      radiusMeters: 100,
      workStartTime: "09:00",
      workEndTime: "18:00",
    },
  });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      fullName: "Admin HR",
      email: "admin@absen.app",
      role: "admin",
      officeId: office.id,
    },
  });

  const employees = await Promise.all(
    ["Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Ross"].map(
      async (name, i) => {
        const pwd = await bcrypt.hash("employee123", 10);
        return prisma.user.create({
          data: {
            username: `employee${i + 1}`,
            password: pwd,
            fullName: name,
            email: `employee${i + 1}@absen.app`,
            role: "employee",
            officeId: office.id,
          },
        });
      }
    )
  );

  for (const emp of employees) {
    for (let d = 0; d < 5; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const checkIn = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 45 + Math.floor(Math.random() * 30));
      const checkOut = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0 + Math.floor(Math.random() * 60));

      await prisma.attendance.create({
        data: {
          userId: emp.id,
          officeId: office.id,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          checkInLat: office.latitude + (Math.random() - 0.5) * 0.001,
          checkInLong: office.longitude + (Math.random() - 0.5) * 0.001,
          status: checkIn.getHours() > 9 ? "late" : "on_time",
        },
      });
    }
  }

  await prisma.leaveRequest.create({
    data: {
      userId: employees[0].id,
      type: "annual",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      reason: "Family vacation planned since last year.",
      status: "pending",
    },
  });

  console.log("Seed data created successfully");
  console.log(`Admin login: admin / admin123`);
  console.log(`Employee login: employee1 / employee123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
