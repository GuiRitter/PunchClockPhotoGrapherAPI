import jwt from 'jsonwebtoken';
import {
	errorMessage, status,
} from '../helper/status';

/**
  * Verify Token
  * @param {object} req 
  * @param {object} res 
  * @param {object} next
  * @returns {object|void} response object 
  */
const verifyToken = async (req, res, next) => {
	const { token } = req.headers;
	if (!token) {
		errorMessage.error = 'Token not provided.';
		return res.status(status.bad).send(errorMessage);
	}
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		req.user = {
			id: decoded.id,
			login: decoded.login
		};
		next();
	} catch (error) {
		errorMessage.error = 'Authentication failed.';
		return res.status(status.unauthorized).send(errorMessage);
	}
};

export default verifyToken;
