import httpStatus from "http-status";

const isAuthenticated = function (req, res, next) {
    if (!req.session.user)
        return res.status(httpStatus.FORBIDDEN).json({ error: "Please login" });
    return next();
};

export default isAuthenticated;
