import { api } from '@/lib/axios'
import { Message } from './types'

export async function getMessages(queueName: string): Promise<Message[]> {
  try {
    const response = await api.get<Message[]>(`/api/rabbitmq/queues/${queueName}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
}