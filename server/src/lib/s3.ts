import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'aws';

const s3Config = STORAGE_PROVIDER === 'supabase'
  ? {
      region: 'auto',
      endpoint: `${process.env.SUPABASE_URL}/storage/v1/s3`,
      credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY || '',
        secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY || '',
      },
      forcePathStyle: true,
    }
  : {
      region: process.env.S3_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
    };

const s3 = new S3Client(s3Config);

const BUCKET = STORAGE_PROVIDER === 'supabase'
  ? (process.env.SUPABASE_S3_BUCKET || 'images')
  : (process.env.S3_BUCKET || 'alok-central-school');

function getPublicUrl(s3Key: string): string {
  if (STORAGE_PROVIDER === 'supabase') {
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${s3Key}`;
  }
  return `https://${BUCKET}.s3.${process.env.S3_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;
}

export async function uploadToS3(
  file: Express.Multer.File,
  folder: string
): Promise<{ s3Url: string; s3Key: string }> {
  const ext = file.originalname.split('.').pop() || 'jpg';
  const s3Key = `${folder}/${randomUUID()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return { s3Url: getPublicUrl(s3Key), s3Key };
}

export async function deleteFromS3(s3Key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
  }));
}
