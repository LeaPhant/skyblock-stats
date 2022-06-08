const _ = require('lodash');

const extendEntry = e => {
    const entry = new Object();

    if (typeof e === 'string')
        entry.id = e;
    else
        Object.assign(entry, e);

    if (!Array.isArray(entry.id))
        entry.id = [entry.id];

    if (e.name === undefined)
        entry.name = _.startCase(entry.id[0]);

    entry.boss = e.boss == true;
    entry.max = e.max ?? module.exports.bestiary_max;

    return entry;
}

module.exports = {
    bestiary_level: {
        1: 10,
        2: 15,
        3: 75,
        4: 150,
        5: 250,
        6: 500,
        7: 1500,
        8: 2500,
        9: 5000,
        10: 15000,
        11: 25000,
        12: 50000,
        13: 100000
    },
    bestiary_boss_level: {
        1: 2,
        2: 3,
        3: 5,
        4: 10,
        8: 25,
        10: 50,
        12: 100
    },
    bestiary_max: 41,
    bestiary_areas: {
        PRIVATE_ISLAND: [
            {
                id: 'cave_spider',
                max: 5
            },
            {
                name: 'Enderman',
                id: 'enderman_private',
                max: 5
            },
            {
                id: 'skeleton',
                max: 5
            },
            {
                id: 'slime',
                max: 5
            },
            {
                id: 'spider',
                max: 5
            },
            {
                id: 'witch',
                max: 5
            },
            {
                id: 'zombie',
                max: 5
            }
        ],
        HUB: [
            {
                name: "Crypt Ghoul",
                id: 'unburried_zombie'
            },
            'old_wolf',
            {
                name: 'Wolf',
                id: 'ruin_wolf'
            },
            'zombie_villager'
        ],
        "SPIDER'S_DEN": [
            {
                id: 'arachne',
                boss: true
            },
            {
                name: "Arachne's Brood",
                id: 'arachne_brood',
            },
            {
                name: "Arachne's Keeper",
                id: 'arachne_keeper'
            },
            {
                name: 'Brood Mother',
                id: 'brood_mother_spider',
                boss: true
            },
            'dasher_spider',
            {
                name: "Gravel Skeleton",
                id: 'respawning_skeleton'
            },
            {
                name: "Rain Slime",
                id: 'random_slime'
            },
            'spider_jockey',
            'splitter_spider',
            'voracious_spider',
            'weaver_spider'
        ],
        CRIMSON_ISLE: [
            {
                id: 'ashfang',
                boss: true
            },
            {
                id: 'barbarian_duke_x',
                boss: true
            },
            {
                id: 'bladesoul',
                boss: true
            },
            {
                id: 'mage_outlaw',
                boss: true
            },
            {
                id: 'magma_cube_boss',
                boss: true
            },
            'flaming_spider',
            'blaze',
            'ghast',
            'magma_cube',
            'matcho',
            {
                name: 'Mushroom Bull',
                id: 'charging_mushroom_cow',
            },
            'pigman',
            'wither_skeleton',
            'wither_spectre'
        ],
        THE_END: [
            {
                name: 'Ender Dragon',
                id: 'dragon',
                boss: true
            },
            'enderman',
            'endermite',
            {
                name: 'Endstone Protector',
                id: 'corrupted_protector',
                boss: true
            },
            'voidling_extremist',
            'voidling_fanatic',
            'watcher',
            {
                name: 'Zealot',
                id: 'zealot_enderman'
            },
            {
                name: 'Obsidian Defender',
                id: 'obsidian_wither'
            }
        ],
        DEEP_CAVERNS: [
            'automaton',
            'butterfly',
            'emerald_slime',
            {
                name: 'Ghost',
                id: 'caverns_ghost'
            },
            'goblin',
            {
                name: 'Grunt',
                id: 'team_treasurite'
            },
            'ice_walker',
            'lapis_zombie',
            {
                name: 'Miner Skeleton',
                id: 'diamond_skeleton'
            },
            {
                name: 'Miner Zombie',
                id: 'diamond_zombie'
            },
            'redstone_pigman',
            'sludge',
            {
                name: 'Sneaky Creeper',
                id: 'invisible_creeper'
            },
            'thyst',
            'treasure_hoarder',
            {
                id: 'worms',
                name: 'Worm'
            },
            'yog'
        ],
        THE_PARK: [
            'howling_spirit',
            'pack_spirit',
            'soul_of_the_alpha'
        ],
        SPOOKY_FESTIVAL: [
            {
                name: 'Crazy Witch',
                id: 'batty_witch'
            },
            {
                id: 'headless_horseman',
                boss: true
            },
            'phantom_spirit',
            'scary_jerry',
            'trick_or_treater',
            'wither_gourd',
            'wraith'
        ],
        CATACOMBS: [
            {
                name: 'Angry Archeologist',
                id: 'diamond_guy'
            },
            'cellar_spider',
            'crypt_dreadlord',
            'crypt_lurker',
            'crypt_souleater',
            'king_midas',
            'lonely_spider',
            'lost_adventurer',
            'scared_skeleton',
            'shadow_assassin',
            'skeleton_grunt',
            'skeleton_master',
            'skeleton_soldier',
            'skeletor_prime',
            {
                name: 'Sniper',
                id: 'sniper_skeleton'
            },
            'super_archer',
            'super_tank_zombie',
            {
                name: 'Tank Zombie',
                id: 'crypt_tank_zombie'
            },
            {
                name: 'Undead Skeleton',
                id: 'dungeon_respawning_skeleton'
            },
            {
                name: 'Withermancer',
                id: 'crypt_witherskeleton'
            },
            'skeletor',
            {
                name: 'Undead',
                id: 'watcher_summon_undead'
            },
            'zombie_commander',
            'zombie_grunt',
            'zombie_knight',
            'zombie_soldier',
        ]
    }
};

for (const b in module.exports.bestiary_areas)
    module.exports.bestiary_areas[b] = module.exports.bestiary_areas[b].map(extendEntry);
