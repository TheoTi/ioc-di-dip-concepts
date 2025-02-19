import dotenv from 'dotenv'
import fastify from 'fastify'

dotenv.config()

import { SESGateway } from './gateways/SESGateway'
import { SQSGateway } from './gateways/SQSGateway'
import { DynamoOrdersTableRepository } from './repository/DynamoOrdersTableRepository'
import { PlaceOrder } from './useCases/PlaceOrder'

const app = fastify()

app.post('/orders', async (_, reply) => {
	const dynamoOrdersTableRepository = new DynamoOrdersTableRepository()
	const sqsGateway = new SQSGateway()
	const sesGateway = new SESGateway()

	const placeOrder = new PlaceOrder(
		dynamoOrdersTableRepository,
		sqsGateway,
		sesGateway,
	)

	const { orderId } = await placeOrder.execute()

	reply.status(201).send({ orderId })
})

app.listen({ port: 3000 }).then(() => {
	console.log('> Server is running at http:localhost:3000')
})
