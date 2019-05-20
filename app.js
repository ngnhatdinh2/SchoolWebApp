var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
app.use(express.static('public'));
app.use(express.static('images'));

app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts'
}));
app.set('view engine', 'hbs');

app.get('/partials/', function (req, res) {
    res.render('header.hbs');
});

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get('/partials/', function (req, res) {
    res.render('footer.hbs');
});

app.listen(4000, () => {
    console.log("server running!");
})
