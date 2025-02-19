import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { sqsUrls } from '../configs/sqsUrls'
import { Order } from '../entities/Order'
import { SQSGateway } from '../gateways/SQSGateway'
import { DynamoOrdersTableRepository } from '../repository/DynamoOrdersTableRepository'

export class PlaceOrder {
	async execute() {
		const customerEmail = 'matheusti.contato@gmail.com'
		const amount = Math.ceil(Math.random() * 1000)

		const order = new Order(customerEmail, amount)
		const dynamoOrdersTableRepository = new DynamoOrdersTableRepository()
		const sqsGateway = new SQSGateway()

		await dynamoOrdersTableRepository.create(order)
		await sqsGateway.publishMessage({ orderId: order.id })

		const sesClient = new SESClient({ region: 'sa-east-1' })
		const sendEmailCommand = new SendEmailCommand({
			Source: 'matheusti.contato@gmail.com',
			Destination: {
				ToAddresses: [customerEmail],
			},
			Message: {
				Subject: {
					Charset: 'utf-8',
					Data: `Pedido #${order.id} confirmado!`,
				},
				Body: {
					Html: {
						Charset: 'utf-8',
						Data: `
							<h1>E aí, galera!</h1>

							<p>Passando aqui só pra avisar que o seu pedido já foi confirmado e em breve você receberá a confirmação do pagamento e a nota fiscal aqui no seu e-mail!</p>
						`,
					},
				},
			},
		})
		await sesClient.send(sendEmailCommand)

		return {
			orderId: order.id,
		}
	}
}
