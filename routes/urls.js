const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const URLData = require('../src/Model/URLData');
const URL_log = require('../src/Model/URL_log');

router.post('/create-url',async function (req,res,next) {
        if(req.isAuthenticated()){
            if(req.body.url){
                const existing = await URLData.findOne({long_url : req.body.url});
                if(!existing){
                    let short_url = await bcrypt.hash(req.body.url,8);
                    short_url = short_url.substr(short_url.length - 7);
                    const entry = {
                        short_url : short_url,
                        long_url : req.body.url,
                        user_id : 1
                    };
                    const newEntry = new URLData(entry);
                    try{
                        newEntry.save();
                    }catch(e){
                        res.status(404).send('Error');
                    }
                    res.status(201).send({url: newEntry.short_url});
                }else{
                    res.status(201).send({url: existing.short_url});
                }
            }else{
                res.status(404).send('URL not found');
            }
        }else{
            console.log('not auth');
            res.redirect('/')
        }
});

router.get('/track',function (req,res) {
    if(req.isAuthenticated()){
        if(req.body.url){
            const log = url_log.find({short_url: req.body.url});
            if(log){
               res.status(201).json(log)
            }else{
                res.status(404).send('Invalid Short-URL');
            }
        }
    }else{
        res.redirect('/');
    }
});

router.get('/:url', async function (req,res) {
    const url = await URLData.findOne({short_url:req.params.url});
    if(url){
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
            short_url: url.short_url,
            platform : platform,
            browser : req.useragent.browser,
            os : req.useragent.os,
            city : ipInfo.city,
            country : ipInfo.country,
            ip: ipInfo.ip
        };
        const urlLog = new URL_log(log);
        urlLog.save();
        res.redirect(url.long_url);
    }else{
        res.status(404).json({error: 'URL not Found or Expired'});
    }
});

module.exports = router;