export const errorMessage = { status: 'error' };

export const status = {
	success: 200,
	error: 500,
	notFound: 404,
	unauthorized: 401,
	conflict: 409,
	created: 201,
	bad: 400,
	noContent: 204,
};

export const successMessage = { status: 'success' };

export const buildError = (log, logName, error, res) =>  {
	log(logName, { error });
	if (error) {
		if (error.message) {
			errorMessage.error = error.message;
		} else if (error.where) {
			errorMessage.error = error.where;
		} else {
			errorMessage.error = error;
		}
	} else {
		errorMessage.error = 'Unknown error.';
	}
	return res.status(status.error).send(errorMessage);
};
