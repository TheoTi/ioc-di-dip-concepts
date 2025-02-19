import { Order } from '../entities/Order'
import type { SESGateway } from '../gateways/SESGateway'
import type { SQSGateway } from '../gateways/SQSGateway'
import type { DynamoOrdersTableRepository } from '../repository/DynamoOrdersTableRepository'

export class PlaceOrder {
	constructor(
		private readonly dynamoOrdersTableRepository: DynamoOrdersTableRepository,
		private readonly sqsGateway: SQSGateway,
		private readonly sesGateway: SESGateway,
	) {}

	async execute() {
		const customerEmail = 'matheusti.contato@gmail.com'
		const amount = Math.ceil(Math.random() * 1000)

		const order = new Order(customerEmail, amount)

		await this.dynamoOrdersTableRepository.create(order)
		await this.sqsGateway.publishMessage({ orderId: order.id })
		await this.sesGateway.sendEmail({
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
