import { ConsoleLogGateway } from '../gateways/ConsoleLogGateway'
import { SESGateway } from '../gateways/SESGateway'
import { SQSGateway } from '../gateways/SQSGateway'
import { DynamoOrdersTableRepository } from '../repository/DynamoOrdersTableRepository'
import { PlaceOrder } from '../useCases/PlaceOrder'
import { Registry } from './Registry'

export const container = Registry.getInstance()

container.register('PlaceOrder', PlaceOrder)
container.register('OrdersRepository', DynamoOrdersTableRepository)
container.register('QueueGateway', SQSGateway)
container.register('EmailGateway', SESGateway)
container.register('LogGateway', ConsoleLogGateway)
