import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodbTables } from '../configs/dynamodbTables'
import type { Order } from '../entities/Order'

export class DynamoOrdersTableRepository {
	private client = DynamoDBDocumentClient.from(
		new DynamoDBClient({
			region: 'sa-east-1',
		}),
	)

	async create(order: Order) {
		const putItemCommand = new PutCommand({
			TableName: dynamodbTables.ordersTable,
			Item: order,
		})

		await this.client.send(putItemCommand)
	}
}
