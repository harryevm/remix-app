// services/mongoData.server.js
import prisma from "../app/db.server";

export async function fetchMongoData(limit = null) {
  return await prisma.Trevor.findMany({
    take: limit ?? undefined,
  });
}


export async function fetchMongoDataById(id) {
  // return await prisma.Trevor.findUnique({
  //   where: { id }, // 'id' should be a string (MongoDB ObjectId as string)
  // });
}

export async function insertMongoData(data) {
  return await prisma.Trevor.create({
    data: {
      ...data,
      createdAt: new Date(),
    },
  });
}


export async function totalPropertyCount() {
  return await prisma.Trevor.count();
}

export async function totalUserCount() {
  const grouped = await prisma.Trevor.findMany({
    select: { email: true },
  });
  const uniqueEmails = new Set(grouped.map(r => r.email));
  return uniqueEmails.size;
}
