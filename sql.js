const Sequelize = require('sequelize');

const crypto = require('crypto');

const sequelize = new Sequelize('my-ng-blog', 'root', 'PolkiOP', {
    host: 'localhost',
    dialect: 'mariadb',
    port: 3306,
    dialectOptions: {
        timezone: process.env.db_timezone
    }
});

const User = sequelize.define('user', {
    name: {type: Sequelize.STRING, allowNull: false},
    password: {type: Sequelize.STRING, allowNull: false},
    salt: {type: Sequelize.STRING, allowNull: false}
});

const Article = sequelize.define('article', {
    title: {type: Sequelize.STRING},
    key: {type: Sequelize.STRING},
    date: {type: Sequelize.DATE},
    content: {type: Sequelize.TEXT},
    description: {type: Sequelize.TEXT},
    imageUrl: {type: Sequelize.STRING},
    viewCount: {type: Sequelize.INTEGER, defaultValue: 0},
    published: {type: Sequelize.BOOLEAN, defaultValue: false}
});

init = function () {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection opened. All ok.')
        })
        .catch(err => {
            console.error('Error on authenticate(): ', err);
        });

    Article.sync({force: true}).then(() => {
        Article.create({
            title: 'My first article',
            content: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta augue scelerisque neque finibus faucibus. Donec ut gravida quam. Duis condimentum metus libero, at congue ipsum vehicula in. Integer fringilla facilisis nisl ut tincidunt. Mauris sed vulputate tellus. Etiam ut tempor ipsum. Phasellus dignissim sem sed mi tristique feugiat.\n' +
                '\n' +
                'Maecenas rutrum justo non ipsum interdum, sit amet congue erat aliquam. Fusce eget neque fringilla, tempor nibh eu, ultrices quam. In id tincidunt lacus. Donec laoreet volutpat nisi, a aliquet mi dignissim pretium. Mauris ut aliquet nulla. Etiam venenatis dignissim volutpat. Nam a enim vulputate, aliquam nulla condimentum, consequat metus. Maecenas semper ornare nulla quis varius. Donec ac metus commodo, vulputate dui sed, consequat augue. Praesent egestas id arcu nec elementum. Nam ut dui vitae orci volutpat fringilla vitae nec ligula. Vestibulum consequat tellus eu ultrices rhoncus. Fusce ipsum turpis, luctus nec tincidunt ut, laoreet id velit. Quisque nec massa vestibulum, luctus metus at, feugiat diam. Proin lacinia lacus in enim venenatis posuere. Aliquam pellentesque est augue, at faucibus turpis lacinia eget. ',
            description: 'This is my first mocked article. Don\'t read it. It\'s just mock. :P',
            key: 'my-first-mock-article',
            date: new Date(),
            imageUrl: 'https://cdn-images-1.medium.com/max/184/1*nbJ41jD1-r2Oe6FsLjKaOg@2x.png',
            published: true
        });
        Article.create({
            title: 'Second article of mine',
            content: ' Proin non pellentesque lacus, sed dapibus sem. Vestibulum imperdiet porttitor nisl eu vehicula. Praesent faucibus libero sit amet consequat interdum. Duis mauris risus, mattis a ligula sit amet, pharetra placerat ante. Aliquam mi augue, scelerisque ac sapien a, pharetra tincidunt enim. In malesuada eros quis tellus eleifend scelerisque. Sed vitae ornare metus. Ut sit amet mauris elit. Morbi vitae mauris vel augue pharetra fermentum. Vivamus auctor, lacus sit amet accumsan posuere, arcu nibh sodales nibh, id semper nulla erat quis lacus. Pellentesque vel arcu non tellus tincidunt viverra a vitae dolor.\n' +
                '\n' +
                'Pellentesque quis sodales risus. Donec pellentesque mauris turpis, sit amet luctus nulla sodales in. Morbi suscipit dictum dapibus. Nulla facilisi. Praesent lobortis lacus nisl, in pretium mauris ornare eu. Donec lacinia felis ac tincidunt semper. Aliquam sit amet blandit nisl. In sit amet eros consequat, pharetra mi id, mollis turpis. Nunc metus sem, facilisis eu augue et, condimentum ullamcorper ante. Aliquam non sodales enim, a placerat est. Sed ornare porta ex, nec pellentesque nulla rhoncus eu. Ut luctus magna lacinia, cursus mi sed, sagittis mauris. Integer venenatis, velit sit amet tristique egestas, purus enim posuere orci, et finibus odio mauris eu felis. Mauris a tellus fringilla, ullamcorper sapien porttitor, sagittis purus. Mauris consequat ornare mauris, sollicitudin ornare justo venenatis ut. Morbi fermentum, neque id euismod tincidunt, tortor mi fringilla tortor, et finibus ligula tellus eget enim. ',
            description: 'Another mocked article. Read it. It\'s just mock. :P',
            key: 'second-mock-article',
            date: new Date(),
            imageUrl: 'https://cdn-images-1.medium.com/max/184/1*nbJ41jD1-r2Oe6FsLjKaOg@2x.png'
        });
    });

    User.sync();
};

getArticles = function (callback) {
    Article.findAll({
        where: {published: true},
        order: [['date', 'DESC']],
        limit: 10,
    }).then(articles => callback(articles));
};

getArticleByOptions = function (options, callback) {
    Article.findOne({
        where: {
            key: options.key,
            published: true
        }
    }).then(article => {
        if (article != null) {
            article.update({
                viewCount: ++article.viewCount
            });
        }
        callback(article);
    });
};

getDashboardArticles = function (callback) {
    Article.findAll().then(articles => callback(articles));
};


getDashboardArticleByKey = function (key, callback) {
    Article.findOne({where: {key: key,}}).then(article => callback(article));
};

updateArticlePublishState = function (req, callback) {
    Article.findOne({where: {id: req.id}}).then(function (article) {
        if (article != null) {
            article.update({
                published: req.published
            });
        }
        callback(article);
    });
};

updateArticle = function (req, callback) {
    Article.findOne({where: {id: req.id}}).then(function (article) {
        if (article != null) {
            article.update({
                title: req.title,
                key: req.key,
                date: req.date,
                imageUrl: req.imageUrl,
                description: req.description,
                content: req.content
            })
        }
        callback(article);
    });
};

deleteArticle = function (id, callback) {
    Article.findOne({where: {id: id}}).then(function (article) {
        if (article != null) {
            article.destroy().then(result => callback(result));
        } else {
            callback(null);
        }
    });
};

createArticle = function (req, callback) {
    Article.create({
        title: req.title,
        key: req.key,
        date: req.date,
        imageUrl: req.imageUrl,
        description: req.description,
        content: req.content
    }).then(article => callback(article));
};

addUser = function (user, callback) {
    User.create({
        name: user.name.toLowerCase(),
        password: user.password,
        salt: user.salt
    }).then(callback(true));
};

login = function (req, callback) {
    User.findOne({
        where: {name: req.name}
    }).then(function (user) {
        if (user !== null) {
            var passwordHash = crypto
                .pbkdf2Sync(req.password, user.salt, 1000, 64, 'sha512')
                .toString('hex');

            if (passwordHash === user.password) {
                callback(true);
                return;
            }
        }

        callback(false);
    })
};

module.exports.init = init;
module.exports.getArticles = getArticles;
module.exports.getArticleByOptions = getArticleByOptions;
module.exports.getDashboardArticles = getDashboardArticles;
module.exports.getDashboardArticleByKey = getDashboardArticleByKey;
module.exports.updateArticlePublishState = updateArticlePublishState;
module.exports.updateArticle = updateArticle;
module.exports.deleteArticle = deleteArticle;
module.exports.createArticle = createArticle;
module.exports.addUser = addUser;
module.exports.login = login;
