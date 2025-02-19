import 'reflect-metadata'

import dotenv from 'dotenv'
import fastify from 'fastify'

dotenv.config()

import { container } from './di/container'
import type { PlaceOrder } from './useCases/PlaceOrder'

const app = fastify()

app.post('/orders', async (_, reply) => {
	const placeOrder = container.resolve<PlaceOrder>('PlaceOrder')

	const { orderId } = await placeOrder.execute()

	reply.status(201).send({ orderId })
})

app.listen({ port: 3000 }).then(() => {
	console.log('> Server is running at http:localhost:3000')
})
