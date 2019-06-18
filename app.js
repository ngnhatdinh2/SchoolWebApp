var express = require('express');
var morgan = require('morgan');
var auth = require('./middlewares/auth');

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
// app.use(require('./middlewares/localAdmin.mdw'));
app.use(require('./middlewares/localTags.mdw'));

app.get('/', (req, res) => {
    res.render('index.hbs');
});
// app.get('/admin', (req, res) => {
//     res.render('admin/index.hbs');
// });
// app.get('/admin/post', (req, res) => {
//     res.render('admin/post.hbs');
// });
// app.get('/admin/category', (req, res) => {
//     res.render('admin/category.hbs');
// });
// app.get('/admin/tag', (req, res) => {
//     res.render('admin/tag.hbs');
// });
// app.get('/admin/user', (req, res) => {
//     res.render('admin/user.hbs');
// });
//
//a
app.use('/admin', auth.isAdmin, require('./routes/admin.route'));
app.use('/editor', auth.isEditor, require('./routes/editor.route'));

app.use('/news', require('./routes/postlist.route'));
app.use('/account', require('./routes/account.route'));
app.use('/categories', require('./routes/category.route'));
app.use('/writer', auth.isWriter, require('./routes/writer.route'));
app.use('/subscriber', auth.isSubscriber, require('./routes/subscriber.route'));

app.use((req, res, next) => {
    res.render('404');
});

app.use((error, req, res, next) => {
    res.render('error', {
        message: error.message,
        error
    })
});


app.listen(4000, () => {
    console.log("server running! http://localhost:4000/");
})
