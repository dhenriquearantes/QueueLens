import { api } from '@/lib/axios'
import { Queue, QueuesResponse } from './types'

export async function getQueues(): Promise<Queue[]> {
  try {
    const response = await api.get<QueuesResponse>('/api/rabbitmq/queues');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching queues:', error);
    throw new Error('Failed to fetch queues');
  }
}
