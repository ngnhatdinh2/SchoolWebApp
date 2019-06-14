var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
app.use(express.static('public'));
app.use(express.static('images'));

app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    helpers: {
        forCate: function (arg1, arg2, options) {
            var rs = '';
            arg2.forEach(item => {
                if (item.danh_muc_cha === arg1.ma_danh_muc)
                    rs += '<a class="dropdown-item" href="#">' + options.fn(item.ten_danh_muc) + '</a>';
            });
            return rs;
        }
    }
}));
app.set('view engine', 'hbs');

// app.use(require('./middlewares/localCateBig.mdw'));
// app.use(require('./middlewares/localCateSmall.mdw'));
app.use(require('./middlewares/localCategory.mdw'));
app.use(require('./middlewares/localCategoryGroup.mdw'));

app.get('/partials/', function (req, res) {
    res.render('header.hbs');
});

app.get('/partials/', function (req, res) {
    res.render('footer.hbs');
});

app.get('/', (req, res) => {
    res.render('index.hbs');
    
});



app.listen(4000, () => {
    console.log("server running! http://localhost:4000/");
})
