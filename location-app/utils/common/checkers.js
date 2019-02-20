export function isEmpty(x) {
	return !x || (x.constructor !== Number && Object.keys(x).length === 0);
}

export function isNothing(obj) {
	return typeof obj === 'undefined' || obj === null;
}
