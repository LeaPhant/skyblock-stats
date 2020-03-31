async function main(){
    const dbUrl = 'mongodb://localhost:27017';
    const dbName = 'sbstats';

    const { MongoClient } = require('mongodb');
    const seedrandom = require('seedrandom');
    const axios = require('axios');
    const credentials = require('../credentials.json');
    const constants = require('./constants');
    const mongo = new MongoClient(dbUrl, { useUnifiedTopology: true });
    await mongo.connect();

    const db = mongo.db(dbName);

    db.collection('usernames').find().forEach(async doc => {
        const randomAnimal = new seedrandom(doc.uuid);

        const animal = Math.floor(randomAnimal() * Math.floor(Object.keys(constants.zoo).length));

        await db.collection('usernames').updateOne(
            { _id: doc._id },
            { $set: { animal } }
        );
    });
}

main();
