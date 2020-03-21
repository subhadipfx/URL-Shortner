const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../src/Model/User');
const URLData = require('../src/Model/URLData');
const URL_log = require('../src/Model/URL_log');
require('dotenv').config();
router.use((req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
});
router.post('/create-url',async function (req,res,next) {
        if(req.body.url){
            const existing = await URLData.findOne({long_url : req.body.url});
            if(!existing){
                let short_url = await bcrypt.hash(req.body.url,8);
                let user_id = req.user.id;
                const user = await User.findById(user_id);
                user.seq = user.seq+1;
                short_url = short_url.substr(short_url.length - 7,3) + user_id.substr(user_id.length-5,3)+req.user.seq+short_url.substr(short_url.length - 3);
                const entry = {
                    short_url : short_url,
                    long_url : req.body.url,
                    user_id : user_id,
                    status: true,
                    exp_date: new Date(
                            new Date().getFullYear(),
                        new Date().getMonth() + 6,
                         new Date().getDate())
                };
                const newEntry = new URLData(entry);
                newEntry.save().then( res => {
                    user.save()
                        .then( result => res.status(200).send({url: process.env.HOST_DOMAIN+newEntry.short_url}))
                        .catch(err => res.status(500).send('Error!! Please try again'))
                    }).catch( err => res.status(500).send('Error!! Please try again'));
            }else if(existing.status){
                res.status(201).send({url: existing.short_url});
            }else {
                existing.status = true;
                existing.save()
                    .then(result => res.status(200).send({url: process.env.HOST_DOMAIN+existing.short_url}))
                    .catch(err => res.status(500).send({error: 'Error!! Please try again'}));
            }
        }else{
            res.status(404).send('URL not found');
        }

});

router.get('/track',function (req,res) {
    console.log('log',req.body);
    if(req.body.url){
        const log = URL_log.find({short_url: req.body.url});
        if(log){
           res.status(201).json(log)
        }else{
            res.status(404).send('Invalid Short-URL');
        }
    }
});

module.exports = router;