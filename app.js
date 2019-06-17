var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

require('./middlewares/view-engine')(app);
require('./middlewares/session')(app);
require('./middlewares/passport')(app);

app.use(require('./middlewares/auth-locals.mdw'));
app.use(require('./middlewares/localCateSmall.mdw'));
app.use(require('./middlewares/localCategoryGroup.mdw'));
app.use(require('./middlewares/localPost.mdw'));
app.use(require('./middlewares/localTags.mdw'));

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.use('/news', require('./routes/postlist.route'));
app.use('/account', require('./routes/account.route'));
app.use('/categories', require('./routes/category.route'));
app.use('/writer', require('./routes/writer.route'));

app.listen(4000, () => {
    console.log("server running! http://localhost:4000/");
})
