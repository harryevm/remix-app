// services/mongoData.server.js
import prisma from "../app/db.server";

export async function fetchMongoData(limit = null) {
  return await prisma.trevor.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit ?? undefined,
  });
}

export async function fetchMongoDataById(id) {
  return await prisma.trevor.findUnique({
    where: { id }, // 'id' should be a string (MongoDB ObjectId as string)
  });
}

export async function insertMongoData(data) {
  return await prisma.trevor.create({
    data: {
      ...data,
      createdAt: new Date(),
    },
  });
}

export async function totalPropertyCount() {
  return await prisma.trevor.count();
}

export async function totalUserCount() {
  const grouped = await prisma.trevor.groupBy({
    by: ["email"],
    _count: true,
  });

  return grouped.length;
}
