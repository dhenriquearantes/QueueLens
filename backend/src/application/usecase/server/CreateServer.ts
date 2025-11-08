import { Server, ServerRepository, CreateServerDTO } from '../../../domain/server';

export default class CreateServer {
  constructor(private serverRepository: ServerRepository) {}

  async execute(data: CreateServerDTO): Promise<Server> {
    if (!data.name || !data.url || !data.port || !data.username || !data.password) {
      throw new Error('Missing required fields');
    }

    return this.serverRepository.create(data);
  }
}
