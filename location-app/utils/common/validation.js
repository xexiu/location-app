import t from 'tcomb-form-native';

export const formValidation = {
	name: t.refinement(t.String, (s) => /\w+[\s]?\w+/.test(s) && s.length <= 15),
	email: t.refinement(t.String, (s) => /@/.test(s)),
	password: t.refinement(t.String, (s) => s.length >= 6)
};
