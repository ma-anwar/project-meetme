import httpStatus from "http-status";

const isAuthenticated = function (req, res, next) {
    if (!req.session.user)
        return res.status(httpStatus.FORBIDDEN).send("Please login first");
    return next();
};

export default isAuthenticated;
