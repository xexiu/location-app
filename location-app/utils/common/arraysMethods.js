export function concat(...args) {
	return args.reduce((acc, val) => [...acc, ...val]);
}
