import type { Constructor } from '../types/utils'

export class Registry {
	private readonly services: Map<string, Constructor<any>> = new Map()

	private static instance: Registry

	private constructor() {}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Registry()
		}

		return this.instance
	}

	register<T>(token: string, implementation: Constructor<T>) {
		if (this.services.has(token)) {
			throw new Error(`${token} is already registered.`)
		}

		this.services.set(token, implementation)
	}

	resolve<T>(token: string): T {
		const Implementation = this.services.get(token)

		if (!Implementation) {
			throw new Error(`"${token}" was not found in the Registry.`)
		}

		const paramTypes: any[] =
			Reflect.getMetadata('design:paramtypes', Implementation) ?? []
		const dependencies = paramTypes.map((_, index) => {
			const dependencyToken = Reflect.getMetadata(
				`inject:${index}`,
				Implementation,
			)

			return this.resolve(dependencyToken)
		})

		return new Implementation(...dependencies)
	}
}
