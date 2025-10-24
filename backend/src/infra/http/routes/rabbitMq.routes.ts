import { Router } from 'express';
import { QueueBrowserRabbitMq } from '../../messaging/RabbitMQ';
import ListQueues from '../../../application/usecase/ListQueues';
import ListMessages from '../../../application/usecase/ListMessages';
import { ServersRepository } from '../../repository/ServersRepository';

const rabbitMq = Router();
const serversRepo = new ServersRepository();

rabbitMq.get('/queues', async (req, res) => {
  try {
    const active = await serversRepo.getActive();
    if (!active) return res.status(400).json({ message: 'No active server selected' });

    const rabbitMqBrowser = new QueueBrowserRabbitMq(active.baseUrl, active.username, active.password);
    const listQueuesUseCase = new ListQueues(rabbitMqBrowser);
    const queues = await listQueuesUseCase.execute();
    
    return res.status(200).json({
      data: queues,
      count: queues.length
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
});

rabbitMq.get('/queues/:queueName/messages', async (req, res) => {
  try {
    const { queueName } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const active = await serversRepo.getActive();
    if (!active) return res.status(400).json({ message: 'No active server selected' });

    const rabbitMqBrowser = new QueueBrowserRabbitMq(active.baseUrl, active.username, active.password);
    const listMessagesUseCase = new ListMessages(rabbitMqBrowser);
    const messages = await listMessagesUseCase.execute(queueName, limit);
    return res.status(200).json({
      data: messages,
      count: messages.length
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
});

export { rabbitMq };
