import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { sqsUrls } from '../configs/sqsUrls'
import type { IQueueGateway } from '../interfaces/gateways/IQueueGateway'

export class SQSGateway implements IQueueGateway {
	private client = new SQSClient({
		region: 'sa-east-1',
	})

	async publishMessage(message: Record<string, unknown>) {
		const command = new SendMessageCommand({
			QueueUrl: sqsUrls.processPaymentQueue,
			MessageBody: JSON.stringify(message),
		})

		await this.client.send(command)
	}
}
