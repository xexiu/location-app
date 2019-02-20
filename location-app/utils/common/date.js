export function getCurrentFullDate() {
	const dateObj = new Date();
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();

	return year + '/' + month + '/' + day;
}

export function getCurrentYear() {
	const dateObj = new Date();

	return dateObj.getUTCFullYear();
}
