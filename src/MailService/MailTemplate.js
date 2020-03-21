

const newUser = (name) => {
    return {
        subject: 'Welcome',
        text: `Hi! ${name}, Welcome`
    }
};

const notifyExpiry = (name,url) =>{
    return {
        subject: 'Shorten URL Expired',
        text: `Hi! ${name}, hope you are doing well, this email is notify you that your shorten URL with ID - ${url} is expired today.
                    Please create a new one with the same Long url`
    }
};

module.exports = {newUser,notifyExpiry};