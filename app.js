let express = require ('express');
mongoose = require('mongoose');
bodyParser = require('body-parser');



let Contact = require('./models/contactModel');
let app = express();
let port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Accept', 'application/json');
    if (!req.accepts('json')) {
        res.status(415);
        res.end();
    }
    else {
        next();

    }
});

contactRouter = require('./Routes/contactRoute')(Contact);

app.use('/contacts', contactRouter);

app.listen(port, function () {
    console.log('Gulp is running on port:' + port);
});
