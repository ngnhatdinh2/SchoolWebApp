var express = require('express');
var morgan = require('morgan');

var exphbs = require('express-handlebars');

var app = express(); 
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
        },
        //định dạng lại ngày
        formatDate: date => {
            var dateWithOffset = new Date(date);
            var dateWithoutOffset = new Date(dateWithOffset.getTime() + dateWithOffset.getTimezoneOffset() * 1000 * 60);
            var options = {day: '2-digit', month: '2-digit', year: 'numeric'}
            return dateWithoutOffset.toLocaleDateString('en-US', options);
        },
    }
}));
app.set('view engine', 'hbs');

app.use(require('./middlewares/localCateSmall.mdw'));
app.use(require('./middlewares/localCategoryGroup.mdw'));
app.use(require('./middlewares/localPost.mdw'));

// app.get('/partials/', function (req, res) {
//     res.render('header.hbs');
// });

// app.get('/partials/', function (req, res) {
//     res.render('footer.hbs');
// });

app.get('/', (req, res, next) => {
    res.render('index.hbs');
});

app.use('/tin-tuc', require('./routes/postlist.route'));



app.listen(4000, () => {
    console.log("server running! http://localhost:4000/");
})
