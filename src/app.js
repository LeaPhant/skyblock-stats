const cluster = require('cluster');
const lib = require('./lib');

async function main(){
    const express = require('express');
    const session = require('express-session');
    const MongoStore = require('connect-mongo')(session);
    const bodyParser = require('body-parser');
    const crypto = require('crypto');
    const cors = require('cors');

    const Redis = require("ioredis");
    const redisClient = new Redis();

    const axios = require('axios');
    require('axios-debug-log');

    const retry = require('async-retry');

    const fs = require('fs-extra');

    const path = require('path');
    const util = require('util');
    const renderer = require('./renderer');

    await renderer.init();

    const credentials = require(path.resolve(__dirname, '../credentials.json'));

    const _ = require('lodash');
    const moment = require('moment-timezone');
    require('moment-duration-format')(moment);

    const { MongoClient } = require('mongodb');
    const helper = require('./helper');
    const constants = require('./constants');
    const { SitemapStream, streamToPromise } = require('sitemap');
    const { createGzip } = require('zlib');
    const twemoji = require('twemoji');

    const mongo = new MongoClient(credentials.dbUrl, { useUnifiedTopology: true });
    await mongo.connect();
    const db = mongo.db(credentials.dbName);

    const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

    const cachePath = path.resolve(__dirname, '../cache');

    await fs.ensureDir(cachePath);

    if(credentials.hypixel_api_key.length == 0)
        throw "Please enter a valid Hypixel API Key. Join mc.hypixel.net and enter /api to obtain one.";

    const app = express();
    const port = 32464;

    let sitemap;

    app.locals.moment = moment;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
    app.use(express.static('public', { maxAge: CACHE_DURATION }));

    app.use(session({
        secret: credentials.session_secret,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            client: mongo
        })
    }));

    require('./api')(app, db);
    require('./apiv2')(app, db);
    require('./donations/kofi')(app, db);

    async function getExtra(){
        const output = {};

        const kofiEntry = await db.collection('donations').findOne({type: 'kofi'});
        const patreonEntry = await db.collection('donations').findOne({type: 'patreon'});

        const cookieEntry = await db.collection('bazaar').findOne({ productId: 'BOOSTER_COOKIE' });

        if(kofiEntry == null || patreonEntry == null)
            return output;

        output.cookie = cookieEntry;

        output.donations = {
            kofi: kofiEntry.amount || 0,
            patreon: patreonEntry.amount || 0
        };

        const topProfiles = await db
        .collection('topViews')
        .find()
        .sort({ total: -1 })
        .toArray();

        for(const profile of topProfiles){
            delete profile.views;
            delete profile.total;
            delete profile.weekly;
            delete profile.daily;
            delete profile.rank;
        }

        output.top_profiles = topProfiles;

        if('recaptcha_site_key' in credentials)
            output.recaptcha_site_key = credentials.recaptcha_site_key;

        output.twemoji = twemoji;

        return output;
    }

    app.all('/stats/:player/:profile?', async (req, res, next) => {
        let paramPlayer = req.params.player.toLowerCase().replace(/[^a-z\d\-\_:]/g, '');
        let paramProfile = req.params.profile ? req.params.profile.toLowerCase() : null;

        const cacheOnly = req.query.cache === 'true';

        const playerUsername = paramPlayer.length == 32 ? await helper.resolveUsernameOrUuid(paramPlayer, db).display_name : paramPlayer;

        try{
            const { profile, allProfiles } = await lib.getProfile(db, paramPlayer, paramProfile, { updateArea: true, cacheOnly });

            const items = await lib.getItems(profile.members[profile.uuid], true, req.query.pack);
            const calculated = await lib.getStats(db, profile, allProfiles, items);

            res.render('stats', { req, items, calculated, _, constants, helper, extra: await getExtra(), page: 'stats' });
        }catch(e){
            console.error(e);

            res.render('index', {
                req,
                error: e,
                player: playerUsername,
                extra: await getExtra(),
                helper,
                page: 'index'
            });

            return false;
        }
    });

    app.all('/texture/:uuid', cors(), async (req, res) => {
        const { uuid } = req.params;

        const filename = `texture_${uuid}.png`;

        try{
            file = await fs.readFile(path.resolve(cachePath, filename));
        }catch(e){
            try{
                file = (await axios.get(`https://textures.minecraft.net/texture/${uuid}`, { responseType: 'arraybuffer' })).data;

                fs.writeFile(path.resolve(cachePath, filename), file, err => {
                    if(err)
                        console.error(err);
                });
            }catch(e){
                res.status(404);
                res.send('texture not found');

                return;
            }
        }

        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`);
        res.contentType('image/png');
        res.send(file);
    });

    app.all('/cape/:username', cors(), async (req, res) => {
        const { username } = req.params;

        const filename = `cape_${username}.png`;

        try{
            file = await fs.readFile(path.resolve(cachePath, filename));

            const fileStats = await fs.stat(path.resolve(cachePath, filename));

            if(Date.now() - stats.mtime > 10 * 1000){
                const optifineCape = await axios.head(`https://optifine.net/capes/${username}.png`);
                const lastUpdated = moment(optifineCape.headers['last-modified']);

                if(lastUpdated.unix() > stats.mtime)
                    throw "optifine cape changed";
            }
        }catch(e){
            try{
                file = (await axios.get(`https://optifine.net/capes/${username}.png`, { responseType: 'arraybuffer' })).data;

                fs.writeFile(path.resolve(cachePath, filename), file, err => {
                    if(err)
                        console.error(err);
                });
            }catch(e){
                res.status(404);
                res.send('no cape for user');

                return;
            }
        }

        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`);
        res.contentType('image/png');
        res.send(file);
    });

    app.all('/head/:uuid', cors(), async (req, res) => {
        const { uuid } = req.params;

        const filename = `head_${uuid}.png`;

        try{
            file = await fs.readFile(path.resolve(cachePath, filename));
        }catch(e){
            file = await renderer.renderHead(`http://textures.minecraft.net/texture/${uuid}`, 6.4);

            fs.writeFile(path.resolve(cachePath, filename), file, err => {
                if(err)
                    console.error(err);
            });
        }

        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`);
        res.contentType('image/png');
        res.send(file);
    });

    app.all('/item(.gif)?/:skyblockId?', cors(), async (req, res) => {
        const skyblockId = req.params.skyblockId || null;
        const item = await renderer.renderItem(skyblockId, req.query, db);

        if(item.error){
            res.status(500);
            res.send(item.error);
            return;
        }

        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`);
        res.contentType(item.mime);
        res.send(item.image);
    });

    app.all('/leather/:type/:color', cors(), async (req, res) => {
        let file;

        if(!["boots", "leggings", "chestplate", "helmet"].includes(req.params.type))
            throw new Error("invalid armor type");

        const { type } = req.params;

        const color = req.params.color.split(",");

        if(color.length < 3)
            throw new Error("invalid color");

        const filename = `leather_${type}_${color.join("_")}.png`;

        try{
            file = await fs.readFile(path.resolve(cachePath, filename));
        }catch(e){
            file = await renderer.renderArmor(type, color);

            fs.writeFile(path.resolve(cachePath, filename), file, err => {
                if(err)
                    console.error(err);
            });
        }

        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`);
        res.contentType('image/png');
        res.send(file);
    });

    app.all('/robots.txt', async (req, res, next) => {
        res.type('text').send(
`User-agent: *
Disallow: /item /head /leather /resources
`);
    });

    app.all('/sitemap.xml', async (req, res, next) => {
        res.header('Content-Type', 'application/xml');
        res.header('Content-Encoding', 'gzip');

        if(sitemap){
            res.send(sitemap);
            return
        }

        try{
            const smStream = new SitemapStream({ hostname: 'https://sky.lea.moe/' });
            const pipeline = smStream.pipe(createGzip());

            const cursor = await db.collection('viewsLeaderboard').find().limit(10000);

            while(await cursor.hasNext()){
                const doc = await cursor.next();

                smStream.write({ url: `/stats/${doc.userInfo.username}` });
            }

            smStream.end();

            streamToPromise(pipeline).then(sm => sitemap = sm);

            pipeline.pipe(res).on('error', (e) => {throw e});
        }catch(e){
            console.error(e)
            res.status(500).end()
        }
    });

    app.all('/random/stats', async (req, res, next) => {
        /*const profile = await db
        .collection('profileStore')
        .aggregate([
            { $match: { apis: true } },
            { $sample: { size: 1 } }
        ]).next();*/

        res.redirect(`/stats/20934ef9488c465180a78f861586b4cf/bf7c14fb018946899d944d56e65222d2`);
    });

    app.all('/favicon.ico', express.static(path.join(__dirname, 'public')));

    app.all('/:player/:profile?', async (req, res, next) => {
        res.redirect(`/stats${req.path}`);
    });

    app.all('/', async (req, res, next) => {
        res.render('index', { error: null, player: null, extra: await getExtra(), helper, page: 'index' });
    });

    app.all('*', async (req, res, next) => {
        res
        .status(404)
        .type('txt')
        .send('Not found')
    });

    app.listen(port, () => console.log(`SkyBlock Stats running on http://localhost:${port}`));
}

if(cluster.isMaster){
    const cpus = Math.min(4, require('os').cpus().length);

    for(let i = 0; i < cpus; i += 1){
        cluster.fork();
    }

    console.log('Running SkyBlock Stats on %i cores', cpus);
}else{
    main();
}
