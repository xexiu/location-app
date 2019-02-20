export async function fetchAsync(apiUrl) {
	const response = await fetch(apiUrl);
	const json = await response.json();

	return json;
}
