import { QueueBrowser } from "../../domain/queue";
import { useAxios } from "../http/axiosHelper";

export class QueueBrowserRabbitMq implements QueueBrowser {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl;
    this.token = Buffer.from(username + ":" + password).toString("base64");
  }

  async listQueues(): Promise<any[]> {
    const response = await useAxios<any[]>({
      url: `${this.baseUrl}/api/queues`,
      method: 'GET',
      token: `Basic ${this.token}`
    });
    return response.data;
  }

  async listMessages(queueName: string): Promise<any[]> {
    const response = await useAxios<any[]>({
      url: `${this.baseUrl}/api/queues/%2F/${queueName}/get`,
      method: 'POST',
      token: `Basic ${this.token}`,
      data: {
        count: 1000,
        ackmode: 'ack_requeue_true', 
        encoding: 'auto'
      }
    });
    return response.data;
  }
}