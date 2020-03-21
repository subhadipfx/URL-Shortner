const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Email_ID,
        pass: process.env.Email_Pass
    }
});

const mailOptions = (to,template) => {
    return {
        from : process.env.Email_ID,
        to: to,
        subject: template.subject,
        text: template.text
    }
};


const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions,(err,data) =>{
        if(err){
            console.error(err);
        }else{
            console.log('Email Sent');
        }
    });
};

module.exports = {   sendMail,
                    mailOptions,
                    templates : require('./MailTemplate')};