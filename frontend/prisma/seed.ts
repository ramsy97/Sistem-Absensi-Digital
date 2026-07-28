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

  const adminPw = await bcrypt.hash("admin123", 10);
  const empPw = await bcrypt.hash("employee123", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: adminPw, fullName: "Admin HR", email: "admin@absen.app", role: "admin", officeId: office.id },
  });

  const employees = await Promise.all([
    prisma.user.upsert({
      where: { username: "employee1" },
      update: {},
      create: { username: "employee1", password: empPw, fullName: "Alice Smith", email: "alice@absen.app", role: "employee", officeId: office.id },
    }),
    prisma.user.upsert({
      where: { username: "employee2" },
      update: {},
      create: { username: "employee2", password: empPw, fullName: "Bob Johnson", email: "bob@absen.app", role: "employee", officeId: office.id },
    }),
    prisma.user.upsert({
      where: { username: "employee3" },
      update: {},
      create: { username: "employee3", password: empPw, fullName: "Charlie Brown", email: "charlie@absen.app", role: "employee", officeId: office.id },
    }),
    prisma.user.upsert({
      where: { username: "employee4" },
      update: {},
      create: { username: "employee4", password: empPw, fullName: "Diana Ross", email: "diana@absen.app", role: "employee", officeId: office.id },
    }),
  ]);

  const now = new Date();
  for (const emp of employees) {
    for (let d = 4; d >= 0; d--) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const checkIn = new Date(date);
      checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      const checkOut = new Date(date);
      checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      const isLate = checkIn.getHours() > 9 || (checkIn.getHours() === 9 && checkIn.getMinutes() > 15);
      await prisma.attendance.create({
        data: {
          userId: emp.id,
          officeId: office.id,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          status: isLate ? "late" : "on_time",
        },
      });
    }
  }

  await prisma.leaveRequest.create({
    data: {
      userId: employees[0].id,
      type: "annual",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 3),
      reason: "Family vacation",
      status: "pending",
    },
  });

  console.log("Seed completed");
}

main().catch(console.error).finally(() => prisma.$disconnect());
