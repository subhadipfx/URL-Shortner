const redis = require('redis');
const PORT = process.env.Redish_PORT || 6379;
const {promisify} = require('util');

const client = redis.createClient(PORT);

const redis_client = {
    get : promisify(client.get).bind(client),
    set: promisify(client.set).bind(client)
};


module.exports = redis_client;