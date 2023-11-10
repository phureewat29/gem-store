import { RabbitServiceName } from '../interface/rabbit.interface';

export const RABBIT_SERVICE_OPTIONS = 'RABBIT_SERVICE_OPTIONS';

export const RABBIT_SERVICES: Record<RabbitServiceName, { queue: string }> = {
  USER_SERVICE: {
    queue: 'user_queue',
  },
  LEDGER_SERVICE: {
    queue: 'ledger_queue',
  },
};
