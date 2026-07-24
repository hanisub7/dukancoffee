"use server";

import { DocumentType } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function requiredString(
  formData: FormData,
  fieldName: string,
): string {
  const value = String(
    formData.get(fieldName) ?? "",
  ).trim();

  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  return value;
}

function optionalString(
  formData: FormData,
  fieldName: string,
): string | null {
  const value = String(
    formData.get(fieldName) ?? "",
  ).trim();

  return value || null;
}

function validateUrl(
  value: string,
  fieldName: string,
): string {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      throw new Error();
    }

    return url.toString();
  } catch {
    throw new Error(
      `${fieldName} must be a valid HTTP or HTTPS URL.`,
    );
  }
}

function parseDocumentType(
  formData: FormData,
): DocumentType {
  const value = String(
    formData.get("documentType") ?? "",
  ).trim();

  if (
    !Object.values(DocumentType).includes(
      value as DocumentType,
    )
  ) {
    throw new Error(
      "A valid document type is required.",
    );
  }

  return value as DocumentType;
}

function parseLanguage(
  formData: FormData,
): string | null {
  const language = optionalString(
    formData,
    "language",
  );

  if (!language) {
    return "en";
  }

  if (
    !/^[a-zA-Z]{2,3}(?:-[a-zA-Z]{2,4})?$/.test(
      language,
    )
  ) {
    throw new Error(
      "Language must use a valid code such as en, ar, en-US, or ar-SA.",
    );
  }

  return language.toLowerCase();
}

async function getEditableProduct(
  productId: string,
) {
  const product =
    await prisma.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
      },
    });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.status === "ARCHIVED") {
    throw new Error(
      "Archived products cannot be modified.",
    );
  }

  return product;
}

function revalidateDocumentPaths(
  productId: string,
) {
  revalidatePath("/admin/products");
  revalidatePath(
    `/admin/products/${productId}`,
  );
  revalidatePath(
    `/admin/products/${productId}/documents`,
  );
}

export async function createDocument(
  productId: string,
  formData: FormData,
): Promise<never> {
  await getEditableProduct(productId);

  const title = requiredString(
    formData,
    "title",
  );

  const url = validateUrl(
    requiredString(formData, "url"),
    "Document URL",
  );

  const documentType =
    parseDocumentType(formData);

  const language = parseLanguage(formData);

  await prisma.document.create({
    data: {
      productId,
      title,
      url,
      documentType,
      language,
    },
  });

  revalidateDocumentPaths(productId);

  redirect(
    `/admin/products/${productId}/documents`,
  );
}

export async function updateDocument(
  productId: string,
  documentId: string,
  formData: FormData,
): Promise<never> {
  await getEditableProduct(productId);

  const existingDocument =
    await prisma.document.findFirst({
      where: {
        id: documentId,
        productId,
      },
      select: {
        id: true,
      },
    });

  if (!existingDocument) {
    throw new Error("Document not found.");
  }

  const title = requiredString(
    formData,
    "title",
  );

  const url = validateUrl(
    requiredString(formData, "url"),
    "Document URL",
  );

  const documentType =
    parseDocumentType(formData);

  const language = parseLanguage(formData);

  await prisma.document.update({
    where: {
      id: existingDocument.id,
    },
    data: {
      title,
      url,
      documentType,
      language,
    },
  });

  revalidateDocumentPaths(productId);

  redirect(
    `/admin/products/${productId}/documents`,
  );
}

export async function deleteDocument(
  productId: string,
  documentId: string,
): Promise<void> {
  await getEditableProduct(productId);

  const document =
    await prisma.document.findFirst({
      where: {
        id: documentId,
        productId,
      },
      select: {
        id: true,
      },
    });

  if (!document) {
    throw new Error("Document not found.");
  }

  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });

  revalidateDocumentPaths(productId);
}