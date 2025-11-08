import { Server, ServerRepository } from '../../../domain/server';

export default class GetActiveServer {
  constructor(private serverRepository: ServerRepository) {}

  async execute(): Promise<Server | null> {
    return this.serverRepository.findActive();
  }
}
