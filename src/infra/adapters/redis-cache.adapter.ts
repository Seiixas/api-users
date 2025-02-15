import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

import { CachePort } from '@/core/ports/cache.port';
import { Env } from '@/shared/env';

export class RedisCacheAdapter implements CachePort {
  private client: Redis;
  private readonly logger = new Logger(RedisCacheAdapter.name);

  constructor() {
    this.client = new Redis({
      host: Env.REDIS_URL,
      port: 6379,
    });
  }

  async connect() {
    try {
      await this.client.connect();
      this.logger.log('IoRedis connected');
    } catch (err) {
      this.logger.error('Error connecting to IoRedis', err);
    }
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const cacheValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, cacheValue, 'EX', ttl);
    } else {
      await this.client.set(key, cacheValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
