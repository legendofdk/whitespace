import { prisma } from "../../lib/prisma.js";
import type { ContactBodyInput } from "./contact.schema.js";

export async function getContactList() {
  return prisma.contactSubmission.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createContact(input: ContactBodyInput) {
  return prisma.contactSubmission.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      message: input.message,
      source: input.source
    }
  });
}
