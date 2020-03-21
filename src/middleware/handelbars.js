const expressHandelBars = require("express-handlebars");

const hbs = expressHandelBars.create({
    extname : "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "../../../views",
    helpers: {
        trim_helper : function(url)  {
            return url.substr(11,10)
        },
        date_helper : function (date) {
                return new Date(date).toDateString();
        },
    }
});

module.exports = hbs;