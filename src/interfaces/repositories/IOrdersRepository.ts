import type { Order } from '../../entities/Order'

export interface IOrdersRepository {
	create(order: Order): Promise<void>
}
