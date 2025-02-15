import fs from 'fs';

import { PutFile, StoragePort } from '@/core/ports/storage.port';

class LocalStorageAdapter implements StoragePort {
  async putFile({ file, filename }: PutFile): Promise<string> {
    fs.writeFileSync(`./uploads/${filename}`, file);
    return `./uploads/${filename}`;
  }

  async delete(fileUrl: string): Promise<void> {
    fs.unlinkSync(fileUrl);
  }
}

export { LocalStorageAdapter };
