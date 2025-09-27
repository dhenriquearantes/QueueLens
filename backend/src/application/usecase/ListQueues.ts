import { QueueBrowser, QueueBrowserInterface } from "../../domain/queue";

export default class ListQueues {
  private browser: QueueBrowser;

  constructor(browser: QueueBrowser) {
    this.browser = browser;
  }

    async execute(): Promise<QueueBrowserInterface[]> {
      const queueList = await this.browser.listQueues();
  
      return queueList.map((queue) => ({
        name: queue.name,
        messages: queue.messages
      }));
  }
}