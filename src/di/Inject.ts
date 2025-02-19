export function Inject(token: string) {
	return (target: any, _: any, propertyIndex: number) => {
		Reflect.defineMetadata(`inject:${propertyIndex}`, token, target)
	}
}
