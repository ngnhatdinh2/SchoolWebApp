var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');

module.exports = function (app) {
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
                return dateWithoutOffset.toLocaleDateString();
            },
            section: hbs_sections()
        }
    }));
    app.set('view engine', 'hbs');
}