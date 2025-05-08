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
  const ensureDate = (value) => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate) ? parsedDate : null; // Return null if invalid date
  };

  return await prisma.trevor.create({
    data: {
      ...data,
      mediaReleaseDate: ensureDate(data.mediaReleaseDate),
      agencyDate: ensureDate(data.agencyDate),
      fairHousingDate: ensureDate(data.fairHousingDate),
      propertyDate: ensureDate(data.propertyDate),
      listingDate: ensureDate(data.listingDate),
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
