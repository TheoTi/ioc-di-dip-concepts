# Inversion of Control, Dependency Injection, and Dependency Inversion

---

### Tools Used

<p align="left">
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" width="36" height="36" alt="TypeScript" /></a>
<a href="https://git-scm.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/git-colored.svg" width="36" height="36" alt="Git" /></a>
<a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg" width="36" height="36" alt="NodeJS" /></a>
<a href="https://aws.amazon.com" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/aws-colored.svg" width="36" height="36" alt="Amazon Web Services" /></a>
<a href="https://www.linux.org" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/linux-colored.svg" width="36" height="36" alt="Linux" /></a>
</p>

---

### Social Media

<p align="left">
<a href="https://www.github.com/theoti" target="_blank" rel="noreferrer">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github-dark.svg" />
<source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github.svg" />
<img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github.svg" width="32" height="32" />
</picture>
</a>
<a href="https://www.linkedin.com/in/matheus-fernandes-14919118a" target="_blank" rel="noreferrer">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/linkedin-dark.svg" />
<source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/linkedin.svg" />
<img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/linkedin.svg" width="32" height="32" />
</picture>
</a>
</p>

---

Design system of the project:
![Inversion of Control, Dependency Injection, and Dependency Inversion concepts](https://personaltheobucket.s3.sa-east-1.amazonaws.com/ioc-di-dip-concepts/ioc-di-dip-concepts-project.png)
---
## SOLID Principles Implemented

##### **S** → Single Responsibility Principle (SRP)
##### **D** → Dependency Inversion Principle (DIP)

---

### Source Code Dependency
The direction in which the dependencies of my code flow.
**Example**: `PlaceOrderUseCase -> SQSGateway -> SQSClient...`


### Flow of Control
The order in which the code execution flow is executed.

![Source Code Dependency and Flow of Control](https://personaltheobucket.s3.sa-east-1.amazonaws.com/ioc-di-dip-concepts/source-code-dependency-and-flow-of-control.png)
---

## Inversion of Control (IoC)
Keep the business logic **CLEAN** and delegate configurations/lifecycles to external systems/frameworks.

**Hollywood Principle**: *Don't call us, we call you.*
**Target**: IoC
**Solution**: Dependency Injection

![IoC](https://personaltheobucket.s3.sa-east-1.amazonaws.com/ioc-di-dip-concepts/ioc.png)
---

## Dependency Injection (DI)
It consists of **INJECTING** a dependency into a class/component/function, regardless of how it is done.
It is a way to invert the **Flow of Control**.

---

### Composition
Composition is when we create an instance of an object inside another, and this object has a lifecycle only within a specific scope and not outside of it.

**Example**:

```typescript
export class PlaceOrder {
    async execute() {
        const customerEmail = 'some@mail.com';
        const amount = Math.ceil(Math.random() * 1000);

        const order = new Order(customerEmail, amount);
    }
}
```

In this case, the instance of **`new Order()`** only exists within the context of the PlaceOrder class.
In other words, **`new Order()`** will only exist if **`PlaceOrder`** exists.

---

### Aggregation
Aggregation occurs when we combine components.

Example:

**`PlaceOrder.ts`**

```typescript
export class PlaceOrder {
    constructor(
        private readonly dynamoOrdersTableRepository: DynamoOrdersTableRepository,
        private readonly sqsGateway: SQSGateway,
        private readonly sesGateway: SESGateway,
    ) {}

    async execute() {
        const customerEmail = 'any@mail.com';
        const amount = Math.ceil(Math.random() * 1000);

        const order = new Order(customerEmail, amount);
    }
}
```

Here, we are aggregating the contracts of **`DynamoOrdersTableRepository`**, **`SQSGateway`**, and **`SESGateway`** into the **`PlaceOrder`** class.

**`main.ts`**

```typescript
app.post('/orders', async (_, reply) => {
    const dynamoOrdersTableRepository = new DynamoOrdersTableRepository();
    const sqsGateway = new SQSGateway();
    const sesGateway = new SESGateway();

    const placeOrder = new PlaceOrder(
        dynamoOrdersTableRepository,
        sqsGateway,
        sesGateway,
    );

    const { orderId } = await placeOrder.execute();

    reply.status(201).send({ orderId });
});
```

In this example, the contracts used in the aggregation with **`PlaceOrder`** have a lifecycle outside the scope in which they are used. They work independently and in isolation.

---

### Associations (has-a)
From the moment a component/class/function has an aggregation, both compositions and aggregations become an association.

Following the example used in the Aggregation section, both **`PlaceOrder`** and the contracts **`DynamoOrdersTableRepository`**, **`SQSGateway`**, and **`SESGateway`** become associations simply because **`PlaceOrder`** has-a **`DynamoOrdersTableRepository`**, and so on.

It is important to have a critical eye when creating abstractions within the system. Creating unnecessary abstractions can bring unnecessary complexity to the project.
Libraries that are used in many parts of the code, such as a hash generation library like bcrypt or external services, tend to be strong candidates for abstractions.

---

## Dependency Inversion Principle (DIP)

**High-level modules should not depend on low-level modules.**
**Both should depend on abstractions.**

**`High-level`** modules: Business rule code.

**`Low-level`** modules: Infrastructure implementations, interaction with data sources, external services, and others.

![DIP](https://personaltheobucket.s3.sa-east-1.amazonaws.com/ioc-di-dip-concepts/dip.png)

Following the example below:

```typescript
export class PlaceOrder {
    constructor(
        private readonly dynamoOrdersTableRepository: DynamoOrdersTableRepository,
        private readonly sqsGateway: SQSGateway,
        private readonly sesGateway: SESGateway,
    ) {}

    async execute() {
        const customerEmail = 'some@mail.com';
        const amount = Math.ceil(Math.random() * 1000);

        const order = new Order(customerEmail, amount);

        await this.dynamoOrdersTableRepository.create(order);
        await this.sqsGateway.publishMessage({ orderId: order.id });
        await this.sesGateway.sendEmail({
            from: 'any@mail.com',
            to: [customerEmail],
            subject: `Order #${order.id} confirmed!`,
            html: `
                <h1>Hey, everyone!</h1>
                <p>Just passing by to let you know that your order has been confirmed, and soon you will receive the payment confirmation and invoice via email!</p>
            `,
        });

        return {
            orderId: order.id,
        };
    }
}
```

**`PlaceOrder`** is a **`High-level`** module, while the implementations **`DynamoOrdersTableRepository`**, **`SQSGateway`**, and **`SESGateway`** are **`Low-level`** modules.

---

## Dependency Injection Container
An object that contains all the dependencies we will use throughout the project.
