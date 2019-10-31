const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
    signJwt: function (username) {
        const payload = {name: username};
        const privateKey = fs.readFileSync('./private.key', 'utf-8');

        const signOptions = {
            expiresIn: '12h',
            algorithm: 'RS256'
        };

        return jwt.sign(payload, privateKey, signOptions);
    },
    verifyJwt: function (token) {

        const publicKey = fs.readFileSync('./public.key', 'utf-8');

        const verifyOptions = {
            expiresIn: '12h',
            algorithm: 'RS256'
        };

        try {
            return jwt.verify(token, publicKey, verifyOptions);
        }catch (e) {
            return false;
        }
    }
};
