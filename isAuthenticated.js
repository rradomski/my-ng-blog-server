const jwtUtil = require('./jwtUtil');

module.exports = function (req, res, next) {
    const token = req.get('Authorization');
    const verified = jwtUtil.verifyJwt(token);

    if (!verified) {
        res.sendStatus(401);
        return;
    }

    next();
};
