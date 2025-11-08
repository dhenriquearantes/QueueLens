import { Server, ServerRepository, CreateServerDTO, UpdateServerDTO } from '../../domain/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

export class JsonServerRepository implements ServerRepository {
  private filePath: string;

  constructor(dataDir: string = './data') {
    this.filePath = path.join(dataDir, 'servers.json');
    this.ensureDataFile();
  }

  private async ensureDataFile(): Promise<void> {
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      try {
        await fs.access(this.filePath);
      } catch {
        await fs.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (error) {
      console.error('Error ensuring data file:', error);
    }
  }

  private async readServers(): Promise<Server[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const servers = JSON.parse(data);
      return servers.map((server: any) => ({
        ...server,
        createdAt: new Date(server.createdAt),
        updatedAt: new Date(server.updatedAt)
      }));
    } catch (error) {
      console.error('Error reading servers:', error);
      return [];
    }
  }

  private async writeServers(servers: Server[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(servers, null, 2), 'utf-8');
  }

  async create(data: CreateServerDTO): Promise<Server> {
    const servers = await this.readServers();

    const newServer: Server = {
      id: randomUUID(),
      name: data.name,
      url: data.url,
      port: data.port,
      username: data.username,
      password: data.password,
      isActive: servers.length === 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    servers.push(newServer);
    await this.writeServers(servers);

    return newServer;
  }

  async findAll(): Promise<Server[]> {
    return this.readServers();
  }

  async findById(id: string): Promise<Server | null> {
    const servers = await this.readServers();
    return servers.find(server => server.id === id) || null;
  }

  async findActive(): Promise<Server | null> {
    const servers = await this.readServers();
    return servers.find(server => server.isActive === true) || null;
  }

  async update(id: string, data: UpdateServerDTO): Promise<Server> {
    const servers = await this.readServers();
    const index = servers.findIndex(server => server.id === id);

    if (index === -1) {
      throw new Error('Server not found');
    }

    const updatedServer: Server = {
      ...servers[index],
      ...data,
      updatedAt: new Date()
    };

    servers[index] = updatedServer;
    await this.writeServers(servers);

    return updatedServer;
  }

  async delete(id: string): Promise<void> {
    const servers = await this.readServers();
    const filteredServers = servers.filter(server => server.id !== id);

    if (filteredServers.length === servers.length) {
      throw new Error('Server not found');
    }

    await this.writeServers(filteredServers);
  }

  async setActive(id: string): Promise<Server> {
    const servers = await this.readServers();
    const targetServer = servers.find(server => server.id === id);

    if (!targetServer) {
      throw new Error('Server not found');
    }

    const updatedServers = servers.map(server => ({
      ...server,
      isActive: server.id === id,
      updatedAt: server.id === id ? new Date() : server.updatedAt
    }));

    await this.writeServers(updatedServers);

    return updatedServers.find(server => server.id === id)!;
  }
}
