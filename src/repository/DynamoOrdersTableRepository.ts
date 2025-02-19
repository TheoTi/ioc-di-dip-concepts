import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodbTables } from '../configs/dynamodbTables'
import { Injectable } from '../di/Injectable'
import type { Order } from '../entities/Order'
import type { IOrdersRepository } from '../interfaces/repositories/IOrdersRepository'

@Injectable()
export class DynamoOrdersTableRepository implements IOrdersRepository {
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
