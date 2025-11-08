import { Server, ServerRepository } from '../../../domain/server';

export default class ListServers {
  constructor(private serverRepository: ServerRepository) {}

  async execute(): Promise<Server[]> {
    return this.serverRepository.findAll();
  }
}
