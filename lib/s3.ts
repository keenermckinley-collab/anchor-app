import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;

if (!region || !bucket) {
  console.warn("AWS_REGION or S3_BUCKET is not configured. Upload APIs will fail.");
}

const s3 = new S3Client({ region });

function sanitizeFilename(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function buildStorageKey(userId: string, fileName: string): string {
  const safe = sanitizeFilename(fileName);
  const day = new Date().toISOString().slice(0, 10);
  return `records/${userId}/${day}/${randomUUID()}-${safe}`;
}

export async function createUploadUrl(storageKey: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: storageKey,
    ContentType: contentType,
    ServerSideEncryption: "AES256",
  });

  return getSignedUrl(s3, command, { expiresIn: 60 * 5 });
}
