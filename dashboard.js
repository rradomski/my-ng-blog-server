const isAuthenticated = require('./isAuthenticated');
module.exports = function (app, sql) {
    app.get('/dashboard/overview', isAuthenticated, function (req, res) {
        sql.getDashboardArticles(result => res.send(result));
    });

    app.get('/dashboard/edit/:key', isAuthenticated, function (req, res) {
        sql.getDashboardArticleByKey(req.params.key, result => res.send(result));
    });

    app.post('/dashboard/article/publish', isAuthenticated, function (req, res) {
        const id = req.body.id;
        const published = req.body.published;
        sql.updateArticlePublishState({id: id, published: published}, function (article) {
            res.send(article);
        });
    });

    app.put('/dashboard/article/update', isAuthenticated, function (req, res) {
        sql.updateArticle(req.body, function (article) {
            res.send(article);
        });
    });

    app.delete('/dashboard/article/:id', isAuthenticated, function (req, res) {
        sql.deleteArticle(req.params.id, result => {
            if (result != null) {
                res.send(result);
            } else {
                res.sendStatus(400).send({message: "Article could not be deleted."})
            }
        });
    });

    app.post('/dashboard/article', isAuthenticated, function (req, res) {
        sql.createArticle(req.body, function (result) {
            res.send(result);
        });
    });
};
