import { Server, ServerRepository } from '../../../domain/server';

export default class GetServer {
  constructor(private serverRepository: ServerRepository) {}

  async execute(id: string): Promise<Server> {
    const server = await this.serverRepository.findById(id);

    if (!server) {
      throw new Error('Server not found');
    }

    return server;
  }
}
