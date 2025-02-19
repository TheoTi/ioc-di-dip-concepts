import { Inject } from '../di/Inject'
import { Order } from '../entities/Order'
import type { IEmailGateway } from '../interfaces/gateways/IEmailGateway'
import type { IQueueGateway } from '../interfaces/gateways/IQueueGateway'
import type { IOrdersRepository } from '../interfaces/repositories/IOrdersRepository'

export class PlaceOrder {
	constructor(
		@Inject('OrdersRepository') private readonly ordersRepository: IOrdersRepository,
		@Inject('QueueGateway') private readonly queueGateway: IQueueGateway,
		@Inject('EmailGateway') private readonly emailGateway: IEmailGateway,
	) {}

	async execute() {
		const customerEmail = 'matheusti.contato@gmail.com'
		const amount = Math.ceil(Math.random() * 1000)

		const order = new Order(customerEmail, amount)

		await this.ordersRepository.create(order)
		await this.queueGateway.publishMessage({ orderId: order.id })
		await this.emailGateway.sendEmail({
			from: 'matheusti.contato@gmail.com',
			to: [customerEmail],
			subject: `Pedido #${order.id} confirmado!`,
			html: `
				<h1>E aí, galera!</h1>

				<p>Passando aqui só pra avisar que o seu pedido já foi confirmado e em breve você receberá a confirmação do pagamento e a nota fiscal aqui no seu e-mail!</p>
			`,
		})

		return {
			orderId: order.id,
		}
	}
}
