const express = require('express');

const app = express();

const PORT = 8000;

const cors = require('cors');

var corsOptions = {
    origin: ['http://localhost:4000', 'http://localhost:4200']
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", function (req, res) {
    res.send("hello from node :P");
});

require("./articles")(app);
