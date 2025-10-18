import { Router } from 'express';
import { QueueBrowserRabbitMq } from '../../messaging/RabbitMQ';
import ListQueues from '../../../application/usecase/ListQueues';
import ListMessages from '../../../application/usecase/ListMessages';

const rabbitMq = Router();

const rabbitMqBrowser = new QueueBrowserRabbitMq(
  process.env.RABBITMQ_URL || '',
  process.env.RABBITMQ_USERNAME || '',
  process.env.RABBITMQ_PASSWORD || ''
);

const listQueuesUseCase = new ListQueues(rabbitMqBrowser);
const listMessagesUseCase = new ListMessages(rabbitMqBrowser);

rabbitMq.get('/queues', async (req, res) => {
  try {
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
    
    const messages = await listMessagesUseCase.execute(queueName);
    return res.status(200).json(messages);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
});

export { rabbitMq };
