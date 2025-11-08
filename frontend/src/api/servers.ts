import { api } from '@/lib/axios';
import { Server, ServersResponse, ServerResponse, CreateServerDTO, UpdateServerDTO } from './types';

export async function getServers(): Promise<Server[]> {
  try {
    const response = await api.get<ServersResponse>('/api/servers');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching servers:', error);
    throw new Error('Failed to fetch servers');
  }
}

export async function getActiveServer(): Promise<Server | null> {
  try {
    const response = await api.get<ServerResponse>('/api/servers/active');
    return response.data.data;
  } catch (error) {
    return null;
  }
}

export async function getServer(id: string): Promise<Server> {
  try {
    const response = await api.get<ServerResponse>(`/api/servers/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching server:', error);
    throw new Error('Failed to fetch server');
  }
}

export async function createServer(data: CreateServerDTO): Promise<Server> {
  try {
    const response = await api.post<ServerResponse>('/api/servers', data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating server:', error);
    throw new Error('Failed to create server');
  }
}

export async function updateServer(id: string, data: UpdateServerDTO): Promise<Server> {
  try {
    const response = await api.put<ServerResponse>(`/api/servers/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating server:', error);
    throw new Error('Failed to update server');
  }
}

export async function deleteServer(id: string): Promise<void> {
  try {
    await api.delete(`/api/servers/${id}`);
  } catch (error) {
    console.error('Error deleting server:', error);
    throw new Error('Failed to delete server');
  }
}

export async function activateServer(id: string): Promise<Server> {
  try {
    const response = await api.patch<ServerResponse>(`/api/servers/${id}/activate`);
    return response.data.data;
  } catch (error) {
    console.error('Error activating server:', error);
    throw new Error('Failed to activate server');
  }
}
