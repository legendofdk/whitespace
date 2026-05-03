import fs from "node:fs/promises";
import path from "node:path";

import type { Request } from "express";
import multer from "multer";

import { env } from "../../config/env.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024
  }
});

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "general";
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-z0-9.-_]/gi, "-").toLowerCase();
}

function runUpload(request: Request) {
  return new Promise<void>((resolve, reject) => {
    upload.single("file")(request, {} as never, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function handleMediaUpload(request: Request) {
  await runUpload(request);

  if (!request.file) {
    throw new Error("FILE_REQUIRED");
  }

  const folder = sanitizeFolder(typeof request.query.folder === "string" ? request.query.folder : "general");
  const uploadsDir = path.resolve(process.cwd(), "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(request.file.originalname) || ".bin";
  const baseName = sanitizeFileName(path.basename(request.file.originalname, extension));
  const fileName = `${Date.now()}-${baseName}${extension}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, request.file.buffer);

  const relativeUrl = `/uploads/${folder}/${fileName}`;

  return {
    fileName,
    folder,
    url: `${env.BACKEND_PUBLIC_URL}${relativeUrl}`,
    relativeUrl
  };
}
