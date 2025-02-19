import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodbTables } from '../configs/dynamodbTables'
import { sqsUrls } from '../configs/sqsUrls'
import { Order } from '../entities/Order'

export class PlaceOrder {
	async execute() {
		const customerEmail = 'matheusti.contato@gmail.com'
		const amount = Math.ceil(Math.random() * 1000)

		const order = new Order(customerEmail, amount)

		const ddbClient = DynamoDBDocumentClient.from(
			new DynamoDBClient({
				region: 'sa-east-1',
			}),
		)
		const putItemCommand = new PutCommand({
			TableName: dynamodbTables.ordersTable,
			Item: {
				id: order.id,
				email: customerEmail,
				amount,
			},
		})
		await ddbClient.send(putItemCommand)

		const sqsClient = new SQSClient({
			region: 'sa-east-1',
		})
		const sendMessageCommand = new SendMessageCommand({
			QueueUrl: sqsUrls.processPaymentQueue,
			MessageBody: JSON.stringify({
				orderId: order.id,
			}),
		})
		await sqsClient.send(sendMessageCommand)

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
