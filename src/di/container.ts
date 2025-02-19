import { SESGateway } from '../gateways/SESGateway'
import { SQSGateway } from '../gateways/SQSGateway'
import { DynamoOrdersTableRepository } from '../repository/DynamoOrdersTableRepository'
import { Registry } from './Registry'

export const container = Registry.getInstance()

container.register(DynamoOrdersTableRepository)
container.register(SQSGateway)
container.register(SESGateway)
