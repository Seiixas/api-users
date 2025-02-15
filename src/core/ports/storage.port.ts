export type PutFile = {
  file: Buffer;
  filename: string;
  contentType?: string;
  contentDisposition?: string;
  isPublic?: boolean;
};

abstract class StoragePort {
  abstract delete(fileUrl: string): Promise<void>;
  abstract putFile({
    file,
    filename,
    contentType,
    isPublic,
    contentDisposition,
  }: PutFile): Promise<string>;
}

export { StoragePort };
