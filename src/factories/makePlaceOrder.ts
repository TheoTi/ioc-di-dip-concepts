import { PlaceOrder } from '../useCases/PlaceOrder'
import { makeDynamoOrdersTableRepository } from './makeDynamoOrdersTableRepository'
import { makeSESGateway } from './makeSESGateway'
import { makeSQSGateway } from './makeSQSGateway'

export function makePlaceOrder() {
	return new PlaceOrder(
		makeDynamoOrdersTableRepository(),
		makeSQSGateway(),
		makeSESGateway(),
	)
}
