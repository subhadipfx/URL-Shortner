const cron = require('node-cron');
const URLData = require('../Model/URLData');
const redis = require('../middleware/redis');
const Mailer = require('../MailService');
const User = require('../Model/User');
//Every Day at 00:05
cron.schedule('0 5 0 * * *', () => {
    const today = new Date().toDateString();
    URLData.find({exp_date : today}).then( urls =>
        urls.map(url => {
            User.findOne({_id:url.user_id}).then(user =>{
                Mailer.sendMail(Mailer.mailOptions(user.email,Mailer.templates.notifyExpiry(user.firstName,url.short_url)));
            });
            redis.del(url.short_url).then(response => console.log('removed from cache')).catch(error => console.log('error in redis@cron'));
            url.status = false;
            url.save();
        })
    );
},{timezone:'Asia/Kolkata'});

module.exports = cron;