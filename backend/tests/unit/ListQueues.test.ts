import ListQueues from "../../src/application/usecase/ListQueues";
import { QueueBrowserRabbitMq } from "../../src/infra/messaging/RabbitMQ";

test("Deve listar filas do RabbitMQ", async () => {
  const listQueues = new ListQueues(new QueueBrowserRabbitMq(
    process.env.RABBITMQ_URL || '',
    process.env.RABBITMQ_USERNAME || '',
    process.env.RABBITMQ_PASSWORD || ''
  ));
  const queues = await listQueues.execute();
  expect(queues).toBeDefined();
  expect(queues.length).toBeGreaterThan(0);
}); 