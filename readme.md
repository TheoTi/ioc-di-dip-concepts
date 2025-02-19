## Salva o pedido no banco de dados
## Publica uma mensagem na fila para processar o pagamento
## Faz o envio de um e-mail de confirmação do pedido para o cliente


S -> Single Responsibility Principle <SRP>

### Source Code Dependency
Direção em que as dependências do meu código vão
Ex: PlaceOrderUseCase -> SQSGateway -> SQSClient...

### Flow of control
Ordem em que é executado o fluxo de execução do código

### Inversion of Control (IoC)
Mantenha a regra de negócio LIMPA e delegue configurações/lifecycles para sistemas/frameworks/coisas externas.

Nós não chamamos o framework.O framework é que nos chama.

Princípio de Hollywood: Don't call us, we call you.

Target: IoC
Solution: Dependency Injection


## Dependency Injection (DI)
Consiste em INJETAR uma dependencia dentro uma classe/componente/função independente da forma como isso é feito.
É uma maneira de inverter o Flow of control.


### Composition
Composition é quando criamos a instância de um objeto dentro de outro, e este objeto tem lifecycle somente dentro de um escopo e não fora dele.

Exemplo:
``

	export class PlaceOrder {
		async execute() {
			const customerEmail = 'matheusti.contato@gmail.com'
			const amount = Math.ceil(Math.random() * 1000)

			const order = new Order(customerEmail, amount)
		}
	}
``
Neste caso, vemos que a instância de new Order() só existe no contexto da classe PlaceOrder.
Ou seja, o new Order() só irá existir caso o PlaceOrder exista.

### Aggregation
Temos um Aggregation quando fazemos a junção entre componentes.

Exemplo:

`PlaceOrder.ts`

``

	export class PlaceOrder {
		constructor(
			private readonly dynamoOrdersTableRepository: DynamoOrdersTableRepository,
			private readonly sqsGateway: SQSGateway,
			private readonly sesGateway: SESGateway,
		) {}

		async execute() {
			const customerEmail = 'matheusti.contato@gmail.com'
			const amount = Math.ceil(Math.random() * 1000)

			const order = new Order(customerEmail, amount)
		}
	}
``
Note que estamos agregando o contrato de `DynamoOrdersTableRepository`, `SQSGateway`e `SESGateway` na classe `PlaceOrder`.

`main.ts`

``
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
``

Neste exemplo podemos ver que os contratos utilizados na agregação com `PlaceOrder` possuem um lifecycle fora do escopo em que são utilizadas. E eles trabalham de forma independente e isolada.

### Associations (has-a)
A partir do momento em que um componente/classe/função possui uma agregação, ambas as `compositions`e `aggregations` se tornam uma `association`.

Seguindo o exemplo utilizado na seção `Aggregation`, tanto `PlaceOrder`como os contratos `DynamoOrdersTableRepository`, `SQSGateway`e `SESGateway` passam a ser `associations` pelo simples fato de que `PlaceOrder`tem um (has-a) `DynamoOrdersTableRepository` e assim por diante.

É interessante ter olhar crítico ao criar abstrações dentro do sistema, criar abstrações desnecessárias pode trazer muita complexidade para o projeto de forma desnecessária.
Bibliotecas que são utilizadas em muitas partes do código como por exemplo uma lib de geração de hash como `bcrypt` que é utilizada em mais de uma área do sistema, ou serviços externos tendem a ser fortes candidatos para abstrações.
