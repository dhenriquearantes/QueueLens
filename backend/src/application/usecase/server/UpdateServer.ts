import { Server, ServerRepository, UpdateServerDTO } from '../../../domain/server';

export default class UpdateServer {
  constructor(private serverRepository: ServerRepository) {}

  async execute(id: string, data: UpdateServerDTO): Promise<Server> {
    return this.serverRepository.update(id, data);
  }
}
