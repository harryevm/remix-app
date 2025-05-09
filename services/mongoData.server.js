// services/mongoData.server.js
import prisma from "../app/db.server";

export async function fetchMongoData(limit = null) {
  return await prisma.trevor.findMany({
    take: limit ?? undefined,
  });
}


export async function fetchMongoDataById(id) {
  return await prisma.trevor.findUnique({
    where: { id }, // 'id' should be a string (MongoDB ObjectId as string)
  });
}

function transformListingData(data) {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    address2: data.address2,
    city: data.city,
    zip: data.zip,
    neighborhood: data.neighborhood,
    propertyType: data["property-type"],
    homeSize: data["home-size"],
    lotSize: data["lot-size"],
    lotUnit: data["lot-unit"],
    yearBuilt: data["year-built"],
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    heating: data.heating,
    cooling: data.cooling,
    waterSource: data.waterSource,
    sewer: data.sewer,
    otherUtilities: data.otherUtilities,
    garage: data.garage,
    garageSpecify: data["garage-specify"],
    basement: data.basement,
    outdoorFeatures: data.outdoorFeatures,
    additionalFeatures: data.additionalFeatures,
    listingCheckbox: data.listingCheckbox,
    mediaRelease: data.mediaRelease,
    mediaReleaseDate: data.mediaReleaseDate,
    description: data.description,
    askingPrice: data.askingPrice,
    preferredContact: data.preferredContact,
    contactHours: data.contactHours,
    agencyCheckbox: data.agencyCheckbox,
    agencySignature: data.agencySignature,
    agencyDate: data.agencyDate,
    fairHousingCheckbox: data.fairHousingCheckbox,
    fairHousingSignature: data.fairHousingSignature,
    fairHousingDate: data.fairHousingDate,
    propertyCheckbox: data.propertyCheckbox,
    propertySignature: data.propertySignature,
    propertyDate: data.propertyDate,
    listingSignature: data.listingSignature,
    listingDate: data.listingDate,
    propertyPhotos: data.propertyPhotos,
    agencyAgreement: data.agencyAgreement,
    fairHousing: data.fairHousing,
    propertyDisclosure: data.propertyDisclosure,
    listingAgreement: data.listingAgreement
  };
}

export function insertMongoData(data) {
  // Prevent accidental `null` override
  delete data.createdAt;

  return prisma.trevor.create({ 
    data:transformListingData(data) 
  });
}





export async function totalPropertyCount() {
  return await prisma.trevor.count();
}

export async function totalUserCount() {
  const grouped = await prisma.trevor.findMany({
    select: { email: true },
  });
  const uniqueEmails = new Set(grouped.map(r => r.email));
  return uniqueEmails.size;
}
