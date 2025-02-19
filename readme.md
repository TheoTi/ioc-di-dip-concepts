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


## Dependency Injection
Consiste em INJETAR uma dependencia dentro uma classe/componente/função independente da forma como isso é feito.
É uma maneira de inverter o Flow of control.
