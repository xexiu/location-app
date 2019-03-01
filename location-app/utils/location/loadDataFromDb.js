export function loadDataFromDb(reference, state, items) {
	reference.on('value', snapshot => {
		const data = [];

		snapshot.forEach(s => {
			const _data = snapshot.child(s.key).val();

			data.push(_data);
		});

		state[items] = data;
		state.loaded = true;

		this.setState(state);
	});
}
