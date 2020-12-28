const cluster = require('cluster');

async function main(){
    const { MongoClient } = require('mongodb');
    const axios = require('axios');
    require('axios-debug-log');

    const util = require('util');
    const _ = require('lodash');

    const nbt = require('prismarine-nbt');
    const parseNbt = util.promisify(nbt.parse);
    
    const constants = require('./../constants.js');

    const helper = require('./../helper');
    const credentials = require('./../../credentials.json');
    
    const mongo = new MongoClient(credentials.dbUrl, { useUnifiedTopology: true });
    await mongo.connect();

    const db = mongo.db(credentials.dbName);

    const Hypixel = axios.create({
        baseURL: 'https://api.hypixel.net/'
    });

    let oldLastUpdated = null, updatingAuctions = false;

    async function updateAllAuctions(pages){
        updatingAuctions = true;

        console.log('updating', pages, 'pages of auctions');

        for(let page = 0; page < pages + 1; page++){
            Hypixel.get('skyblock/auctions', { params: { key: credentials.hypixel_api_key, page }}).then(async response => {
                const { auctions } = response.data;

                for(const auction of auctions){
                    try{
                    const doc = {
                        uuid: auction.uuid,
                        bin: auction.bin === true,
                        auctioneer: auction.auctioneer,
                        start: new Date(auction.start),
                        end: new Date(auction.end),
                        starting_bid: auction.starting_bid,
                        bids: auction.bids.length,
                        highest_bid: auction.highest_bid_amount,
                        highest_bidder: auction.bids.length > 0 ? auction.bids.pop().bidder : null,
                        name: auction.item_name
                    };

                    const buf = Buffer.from(auction.item_bytes, 'base64');

                    const data = nbt.simplify(await parseNbt(buf)).i[0];

                    if(helper.hasPath(data, 'tag', 'ExtraAttributes')){
                        const { ExtraAttributes } = data.tag;

                        if(helper.hasPath(ExtraAttributes, 'uuid'))
                            doc.item_uuid = ExtraAttributes.uuid;

                        if(helper.hasPath(ExtraAttributes, 'id'))
                            doc.texture = `/item/${ExtraAttributes.id}`;

                        if(helper.hasPath(ExtraAttributes, 'petInfo')){
                            const petInfo = JSON.parse(ExtraAttributes.petInfo);

                            doc.pet_info = petInfo;
                            doc.pet_type = petInfo.type;
                            doc.pet_level = (constants.pet_level(petInfo.tier, petInfo.exp)).level;

                            const petData = constants.pet_data[petInfo.type] || {
                                type: '???',
                                emoji: '❓',
                                head: '/head/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40'
                            };

                            doc.texture = petData.head;

                            doc.name = _.startCase(petInfo.type.toLowerCase());
                        }
                    }

                    await db
                    .collection('auctions')
                    .updateOne(
                        { uuid: doc.uuid },
                        { $set: doc },
                        { upsert: true }
                    );
                    }catch(e){ console.error(e); }
                }
            }).catch(() => {});

            await new Promise(r => setTimeout(r, 300));
        }

        updatingAuctions = false;

        console.log('done');
    }

    async function updateAuctions(){
        try{
            const response = await Hypixel.get('skyblock/auctions', { params: { key: credentials.hypixel_api_key }});

            const { data } = response;

            const { lastUpdated, totalPages } = data;

            if(lastUpdated != oldLastUpdated && !updatingAuctions){
                oldLastUpdated = lastUpdated;

                updateAllAuctions(totalPages);
            }
        }catch(e){
            console.error(e);
        }

        setTimeout(updateAuctions, 1000 * 10);
    }

    updateAuctions();
}

if(cluster.isMaster)
    main();
