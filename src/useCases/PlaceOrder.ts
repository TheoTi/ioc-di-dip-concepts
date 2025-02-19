import { Order } from '../entities/Order'
import { SESGateway } from '../gateways/SESGateway'
import { SQSGateway } from '../gateways/SQSGateway'
import { DynamoOrdersTableRepository } from '../repository/DynamoOrdersTableRepository'

export class PlaceOrder {
	async execute() {
		const customerEmail = 'matheusti.contato@gmail.com'
		const amount = Math.ceil(Math.random() * 1000)

		const order = new Order(customerEmail, amount)
		const dynamoOrdersTableRepository = new DynamoOrdersTableRepository()
		const sqsGateway = new SQSGateway()
		const sesGateway = new SESGateway()

		await dynamoOrdersTableRepository.create(order)
		await sqsGateway.publishMessage({ orderId: order.id })
		await sesGateway.sendEmail({
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
