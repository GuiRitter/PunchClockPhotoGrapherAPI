import dbQuery from '../db/dev/dbQuery';

import {
	arePasswordsEqual,
	isNonEmptyString,
	generateUserToken
} from '../helper/validation';

import {
	errorMessage,
	status,
	successMessage
} from '../helper/status';

export const checkToken = async (req, res) => res.status(status.success).send(successMessage);

export const signIn = async (req, res) => {
	const { login, password } = req.body;
	if (!isNonEmptyString(login)) {
		errorMessage.error = 'Invalid login.';
		return res.status(status.bad).send(errorMessage);
	}
	if (!isNonEmptyString(password)) {
		errorMessage.error = 'Invalid password.';
		return res.status(status.bad).send(errorMessage);
	}
	const query = 'SELECT * FROM ´user´ WHERE login = $1';
	try {
		const { rows } = await dbQuery.query(query, [login]);
		const dbResponse = rows[0];
		if (!dbResponse) {
			errorMessage.error = 'User not found.';
			return res.status(status.notFound).send(errorMessage);
		}
		if (!arePasswordsEqual(dbResponse.password, password)) {
			errorMessage.error = 'Wrong password.';
			return res.status(status.bad).send(errorMessage);
		}
		const token = generateUserToken(dbResponse.login, dbResponse.id);
		delete dbResponse.password;
		successMessage.data = dbResponse;
		successMessage.data.token = token;
		return res.status(status.success).send(successMessage);
	} catch (error) {
		errorMessage.error = 'Sign in failed.';
		return res.status(status.error).send(errorMessage);
	}
};
