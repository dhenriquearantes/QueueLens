import { QueueBrowser, QueueBrowserMessageInterface } from "../../domain/queue";

export default class ListMessages {
  private browser: QueueBrowser;

  constructor(browser: QueueBrowser) {
    this.browser = browser;
  }

    async execute(queueName: string, limit: number): Promise<QueueBrowserMessageInterface[]> {
      const queueList = await this.browser.listMessages(queueName, limit);
  
      return queueList.map((message: any, index: number) => {
        const payload = JSON.parse(message.payload || '{}');
        
        return {
          id: `${message.routing_key}-${index}`,
          timestamp: payload.date_time ?? '',
          payload: payload
        };
      });
  }
} 