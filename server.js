const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const sql = require('./sql');

const PORT = 8000;

const corsOptions = {
    origin: ['http://localhost:4000', 'http://localhost:4200']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    sql.init();
});

app.get("/", function (req, res) {
    res.send('hello from node :P');
});

require('./articles.js')(app, sql);
require('./dashboard.js')(app, sql);
require('./auth')(app, sql);
