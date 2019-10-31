module.exports = function (app, sql) {
    const jwtUtil = require('./jwtUtil');
    const crypto = require('crypto');

    app.post('/user/register', function (req, res) {
        req.body.salt = crypto.randomBytes(16).toString("hex");

        req.body.password = crypto
            .pbkdf2Sync(req.body.password, req.body.salt, 1000, 64, 'sha512')
            .toString('hex');

        sql.addUser(req.body, function (result) {
            res.send(result);
        });
    });

    app.post('/user/login', function (req, res) {
        const name = req.body.name;
        const password = req.body.password;

        sql.login({name, password}, result => {
            if (!result) {
                console.log("Authentication Failed");
                res.sendStatus(401);
            } else {
                console.log("Authentication Successful");
                let token = jwtUtil.signJwt(name);
                res.send({token});
            }
        });
    });

    app.post('/user/auth', function (req, res) {
        let valid = jwtUtil.verifyJwt(req.body.token);
        res.send(valid !== false);
    });
};
