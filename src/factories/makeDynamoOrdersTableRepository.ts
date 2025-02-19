import { DynamoOrdersTableRepository } from '../repository/DynamoOrdersTableRepository'

export function makeDynamoOrdersTableRepository() {
	return new DynamoOrdersTableRepository()
}
