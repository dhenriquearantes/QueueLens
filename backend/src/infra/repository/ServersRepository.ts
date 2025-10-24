import { getRedisClient } from '../redis/RedisClient';

export interface RabbitServer {
  id: string;
  name: string;
  baseUrl: string; // http(s)://host:port for RabbitMQ Management API
  username: string;
  password: string;
}

const SERVERS_KEY = 'queuelens:servers'; // hash id -> json
const ACTIVE_KEY = 'queuelens:activeServerId'; // string id

export class ServersRepository {
  async list(): Promise<RabbitServer[]> {
    const client = getRedisClient();
    const map = await client.hgetall(SERVERS_KEY);
    return Object.values(map).map((json) => JSON.parse(json));
  }

  async get(id: string): Promise<RabbitServer | null> {
    const client = getRedisClient();
    const json = await client.hget(SERVERS_KEY, id);
    return json ? JSON.parse(json) : null;
  }

  async upsert(server: RabbitServer): Promise<void> {
    const client = getRedisClient();
    await client.hset(SERVERS_KEY, server.id, JSON.stringify(server));
  }

  async remove(id: string): Promise<void> {
    const client = getRedisClient();
    await client.hdel(SERVERS_KEY, id);
    const activeId = await this.getActiveId();
    if (activeId === id) {
      await this.clearActive();
    }
  }

  async setActive(id: string): Promise<void> {
    const client = getRedisClient();
    await client.set(ACTIVE_KEY, id);
  }

  async clearActive(): Promise<void> {
    const client = getRedisClient();
    await client.del(ACTIVE_KEY);
  }

  async getActiveId(): Promise<string | null> {
    const client = getRedisClient();
    const id = await client.get(ACTIVE_KEY);
    return id;
  }

  async getActive(): Promise<RabbitServer | null> {
    const id = await this.getActiveId();
    if (!id) return null;
    return this.get(id);
  }
}
