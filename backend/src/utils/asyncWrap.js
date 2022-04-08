/* Async controllers - (https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware) */

const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncWrapper;
