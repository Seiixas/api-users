import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { PutFile, StoragePort } from '@/core/ports/storage.port';
import { Env } from '@/shared/env';

export class S3StorageAdapter implements StoragePort {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      endpoint: Env.AWS_ENDPOINT,
      region: Env.AWS_REGION,
      credentials: {
        accessKeyId: Env.AWS_ACCESS_KEY_ID,
        secretAccessKey: Env.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  async delete(fileUrl: string): Promise<void> {
    const filename = fileUrl.replace(
      `${Env.AWS_ENDPOINT}/${Env.AWS_BUCKET_NAME}/`,
      '',
    );

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: Env.AWS_BUCKET_NAME,
        Key: filename,
      }),
    );
  }

  async putFile({
    file,
    filename,
    contentDisposition,
    contentType,
    isPublic = false,
  }: PutFile): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: Env.AWS_BUCKET_NAME,
      Key: filename,
      Body: file,
      ...(isPublic && { ACL: 'public-read' }),
      ...(contentType && { ContentType: contentType }),
      ...(contentDisposition && {
        ContentDisposition: 'inline; filename=filename.png',
      }),
    });

    await this.s3.send(command);

    return `${Env.AWS_ENDPOINT}/${Env.AWS_BUCKET_NAME}/${filename}`;
  }
}
