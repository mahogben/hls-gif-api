'use strict';

const express = require('express');
const exphbs = require('express-handlebars');

const index = require('./routes/index');

const app = express();

app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        partialsDir: ['views/partials/']
    })
);
app.set('view engine', 'handlebars');

app.use('/', index);

app.set('port', process.env.PORT || 9090);
app.set('ip', process.env.NODEJS_IP || 'localhost');

app.listen(app.get('port'), function() {
    console.log('%s: Node server started on %s ...', Date(Date.now()), app.get('port'));
});