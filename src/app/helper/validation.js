import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
  * Hash Password Method
  * @param {string} password
  * @returns {string} returns hashed password
  */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
export const hashPassword = password => bcrypt.hashSync(password, salt);

/**
  * comparePassword
  * @param {string} hashPassword
  * @param {string} password
  * @returns {Boolean} return True or False
  */
export const arePasswordsEqual = (hashedPassword, password) => {
	return bcrypt.compareSync(password, hashedPassword);
};

export const isNonEmptyString = input => (!!input) && (input.length > 0) && (!Array.isArray(input));

/**
  * Generate Token
  * @param {string} id
  * @returns {string} token
  */
export const generateUserToken = (login, id) => jwt.sign({ id, login }, process.env.SECRET, { expiresIn: '3d' });
