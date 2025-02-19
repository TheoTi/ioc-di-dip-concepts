import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { sqsUrls } from '../configs/sqsUrls'

export class SQSGateway {
	private client = new SQSClient({
		region: 'sa-east-1',
	})

	async publishMessage(message: Record<string, unknown>) {
		const sendMessageCommand = new SendMessageCommand({
			QueueUrl: sqsUrls.processPaymentQueue,
			MessageBody: JSON.stringify(message),
		})
		await this.client.send(sendMessageCommand)
	}
}
