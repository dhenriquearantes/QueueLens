import { api } from '@/lib/axios'

export interface RabbitServer {
  id: string
  name: string
  baseUrl: string
  username: string
  password: string
}

export interface ServersResponse {
  data: RabbitServer[]
  activeId: string | null
  count: number
}

export async function listServers() {
  const { data } = await api.get<ServersResponse>('/api/servers')
  return data
}

export async function addServer(server: RabbitServer) {
  await api.post('/api/servers', server)
}

export async function deleteServer(id: string) {
  await api.delete(`/api/servers/${id}`)
}

export async function activateServer(id: string) {
  await api.post(`/api/servers/${id}/activate`)
}

export async function testServer(payload: Pick<RabbitServer, 'baseUrl' | 'username' | 'password'>) {
  const { data } = await api.post<{ ok: boolean; count?: number; message?: string }>(`/api/servers/test`, payload)
  return data
}
