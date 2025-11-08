import { ServerRepository } from '../../../domain/server';

export default class DeleteServer {
  constructor(private serverRepository: ServerRepository) {}

  async execute(id: string): Promise<void> {
    return this.serverRepository.delete(id);
  }
}
