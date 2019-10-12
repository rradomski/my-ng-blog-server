const ARTICLES = require("./mock-articles");

module.exports = function (app) {
    app.get("/articles", function (req, res) {
        res.send(ARTICLES);
    });

    app.get("/articles/:key", function (req, res) {
        res.send(ARTICLES.filter(article => article.key === req.params.key)[0]);
    })
};
