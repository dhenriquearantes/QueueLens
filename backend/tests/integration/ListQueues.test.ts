import { useAxios } from "../../src/infra/http/axiosHelper";

test("Deve listar filas do RabbitMQ", async () => {
  const response = await useAxios({
    url: "http://localhost:3000/api/rabbitmq/queues",
    method: "GET",
  });

  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
});
