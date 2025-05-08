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

async function insertMongoData(data) {
  return await prisma.trevor.create({
    data: {
      ...data,
      mediaReleaseDate: data.mediaReleaseDate ? new Date(data.mediaReleaseDate) : null,  // Handle DateTime conversion
      agencyDate: data.agencyDate ? new Date(data.agencyDate) : null,
      fairHousingDate: data.fairHousingDate ? new Date(data.fairHousingDate) : null,
      propertyDate: data.propertyDate ? new Date(data.propertyDate) : null,
      listingDate: data.listingDate ? new Date(data.listingDate) : null,
      createdAt: new Date(),  // Current date for createdAt
      lotUnit: data.lotUnit || null,  // Handle missing lotUnit
      garageSpecify: data.garageSpecify || null,  // Handle missing garageSpecify
      basement: data.basement || null,  // Handle missing basement
      outdoorFeatures: data.outdoorFeatures || null,  // Handle missing outdoorFeatures
      additionalFeatures: data.additionalFeatures || null,  // Handle missing additionalFeatures
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
