var express = require('express');
var morgan = require('morgan');

var exphbs = require('express-handlebars');

var app = express(); 0
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    helpers: {
        forCate: function (arg1, arg2, options) {
            var rs = ''
            arg1.forEach(gr => {
                rs += '<li class="nav-item dropdown"> <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">' + options.fn(gr.name) + '</a>';
                rs += '<div class="dropdown-menu">';
                arg2.forEach(item => {
                    if (item.categorygroup_id === gr.id) {
                        rs += '<a class="dropdown-item" href="#">' + options.fn(item.name) + '</a>';
                    }
                });
                rs += '</div> </li>'
            });
            return rs;
        }
    }
}));
app.set('view engine', 'hbs');

app.use(require('./middlewares/localCateSmall.mdw'));
app.use(require('./middlewares/localCategoryGroup.mdw'));
app.use(require('./middlewares/localPost.mdw'));
app.use(require('./middlewares/localAdmin.mdw'));

app.get('/partials/', function (req, res) {
    res.render('header.hbs');
});

app.get('/partials/', function (req, res) {
    res.render('footer.hbs');
});

app.get('/', (req, res) => {
    res.render('index.hbs');

});
app.get('/admin', (req, res) => {
    res.render('admin/index.hbs');
});
app.get('/admin/category', (req, res) => {
    res.render('admin/category.hbs');
});
app.get('/admin/category', (req, res) => {
    res.render('admin/category.hbs');
});
app.get('/admin/tag', (req, res) => {
    res.render('admin/tag.hbs');
});
app.get('/admin/user', (req, res) => {
    res.render('admin/user.hbs');
});


app.listen(4001, () => {
    console.log("server running! http://localhost:4000/");
})
