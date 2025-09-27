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
}