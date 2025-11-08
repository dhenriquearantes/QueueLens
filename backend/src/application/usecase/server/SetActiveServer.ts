import { Server, ServerRepository } from '../../../domain/server';

export default class SetActiveServer {
  constructor(private serverRepository: ServerRepository) {}

  async execute(id: string): Promise<Server> {
    return this.serverRepository.setActive(id);
  }
}
