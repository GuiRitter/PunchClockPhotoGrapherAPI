export const getLog = file => (method, data) => console.log({ timeStamp: (new Date()).toISOString(), file, method, ...data});
