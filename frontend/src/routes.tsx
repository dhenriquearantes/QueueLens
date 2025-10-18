import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import QueueMessages from './pages/QueueMessages'
import Queues from './pages/Queues'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/queues',
    element: <Queues />
  },
  {
    path: '/queues/:queueId/messages',
    element: <QueueMessages />
  }
])
