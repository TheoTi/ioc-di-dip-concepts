type TConstructor<T> = new (...args: any[]) => T

export class Registry {
	private readonly services: Map<string, TConstructor<any>> = new Map()

	private static instance: Registry

	private constructor() {}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Registry()
		}

		return this.instance
	}

	register<T>(implementation: TConstructor<T>) {
		const token = implementation.name

		if (this.services.has(token)) {
			throw new Error(`${token} is already registered.`)
		}

		this.services.set(token, implementation)
	}

	resolve<T>(implementation: TConstructor<T>): T {
		const token = implementation.name
		const Impl = this.services.get(token)

		if (!Impl) {
			throw new Error(`"${token}" was not found in the Registry.`)
		}

		return new Impl()
	}
}
