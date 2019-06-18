var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var moment = require('moment');

module.exports = function (app) {
    app.engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/layouts',
        helpers: {
            forCate: function (arg1, arg2, options) {
                var rs = ''
                arg1.forEach(gr => {
                    rs += '<li class="has-dropdown"> <a href="#">' + options.fn(gr.name) + '</a>';
                    rs += '<div class="dropdown"> <div class="dropdown-body"> <ul class="dropdown-list">';
                    arg2.forEach(item => {
                        if (item.categorygroup_id === gr.id) {
                            rs += '<li><a href="category.html">' + options.fn(item.name) +'</a></li>';
                        }
                    });
                    rs += '</ul> </div> </div> </li>'
                });
                return rs;
            },
            //định dạng lại ngày
            formatDate: date => {
                return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            },
            //hàm so sánh
            ifEq: (arg1, arg2, options) => {
                return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
            },
            section: hbs_sections()
        }
    }));
    app.set('view engine', 'hbs');
}