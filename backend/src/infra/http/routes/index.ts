import cors from 'cors';
import { Router } from 'express';
import { rabbitMq } from './rabbitMq.routes';

const router = Router();

router.use(cors());

router.get('/', (req, res) => {
    return res.status(201).json({
        response: 'QueueHoleView online'
    })
})

router.use('/rabbitmq', rabbitMq);

export { router };