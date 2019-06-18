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
            formatStatus: status => {
                var rs = '';
                switch (status) {
                    case 0:
                        rs = '<i class="fa fa-clock-o" style="color:gray"></i>';
                        break;
                    case 1:
                        rs = '<i class="fa fa-check " style="color:green"></i>';
                        break;
                    case 2:
                        rs = '<i class="fa fa-times" style="color:red"></i>';
                }
                return rs;
            },

            isPublished: (postid, status) => {
                if (status == 1)
                    return '';
                else
                    return '<a href="/writer/editpost/' + postid + '" class="btn btn-outline-primary btn-sm" role="button"><i class="fa fa-pencil" aria-hidden="true" style="color: blue"></i></a>';
            },


            forCateInWriter: (group, cate) => {
                var result = '';
                group.forEach((gr) => {
                    result += `<optgroup label="${gr.name}">`;
                    cate.forEach(cate => {
                        if (cate.categorygroup_id === gr.id) {
                            result += `<option value="${cate.id}"`;
                            if (cate.isSelected)
                                result +=`selected`;
                            result += `>${cate.name}</option>`;
                        }
                    })
                    result += `</optgroup>`;
                })
                return result;
            },
            //hàm so sánh
            ifEq: (arg1, arg2, options) => {
                return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
            },
            formatFullBody: (body) =>{
                return body;
            },
            section: hbs_sections()
        }
    }));
    app.set('view engine', 'hbs');
}