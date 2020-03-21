const express = require('express');
const router = express.Router();
const URLData = require('../src/Model/URLData');
const URL_log = require('../src/Model/URL_log');
const redis = require('../src/middleware/redis');

const log = async function(req,res,next,url) {
    console.log(url);
    const ipInfo = req.ipInfo;
    let platform;
    if(req.useragent.isMobile){
        platform = "mob";
    }else if(req.useragent.isDesktop){
        platform = "pc";
    }else if(req.useragent.isBot){
        platform = "bot"
    }
    const log = {
        short_url: url,
        platform : platform,
        browser : req.useragent.browser,
        os : req.useragent.os,
        city : ipInfo.city,
        country : ipInfo.country,
        ip: ipInfo.ip
    };
    URL_log.create(log).then( result =>  console.log('logged')).catch( err => console.err('Error in redirect Router log',err));
    next();
};

const cache = async function (req,res,next,url) {
    await redis.get(url).then( data => {
        if(data != null){
            // console.log('cache');
            res.redirect(data);
        }else{
            next();
        }
    }).catch(err => console.error('redis-get error in redirectRouter',err));
};

router.param('url',log);
router.param('url', cache);

router.get('/:url', async function (req,res) {
    URLData.findOne({short_url:req.params.url}).then(url =>{
        if(url){
            if(url.status){
                redis.set(url.short_url,url.long_url).then(console.log('added to redis'))
                    .catch(err => console.error('redis-set error in redirectRouter',err));
                res.redirect(url.long_url);
            }else{
                res.status(200).json({error: 'URL expired,Please contact admin'})
            }
        }else{
            res.status(404).json({error: 'URL not Found'});
        }
    }).catch( err => res.status(500).json({error: 'Please Try again!!'}));
});

module.exports = router;