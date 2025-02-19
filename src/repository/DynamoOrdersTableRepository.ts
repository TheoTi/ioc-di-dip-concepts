import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodbTables } from '../configs/dynamodbTables'
import { Inject } from '../di/Inject'
import type { Order } from '../entities/Order'
import type { ILogGateway } from '../interfaces/gateways/ILogGateway'
import type { IOrdersRepository } from '../interfaces/repositories/IOrdersRepository'

export class DynamoOrdersTableRepository implements IOrdersRepository {
	constructor(
		@Inject('LogGateway') private readonly logGateway: ILogGateway
	) {}

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

		await this.logGateway.log({ ...order })

		await this.client.send(putItemCommand)
	}
}
