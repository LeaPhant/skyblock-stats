module.exports = {
    pet_rarity_offset: {
        common: 0,
        uncommon: 6,
        rare: 11,
        epic: 16,
        legendary: 20
    },

    pet_levels: [
        100,
        110,
        120,
        130,
        145,
        160,
        175,
        190,
        210,
        230,
        250,
        275,
        300,
        330,
        360,
        400,
        440,
        490,
        540,
        600,
        660,
        730,
        800,
        880,
        960,
        1050,
        1150,
        1260,
        1380,
        1510,
        1650,
        1800,
        1960,
        2130,
        2310,
        2500,
        2700,
        2920,
        3160,
        3420,
        3700,
        4000,
        4350,
        4750,
        5200,
        5700,
        6300,
        7000,
        7800,
        8700,
        9700,
        10800,
        12000,
        13300,
        14700,
        16200,
        17800,
        19500,
        21300,
        23200,
        25200,
        27400,
        29800,
        32400,
        35200,
        38200,
        41400,
        44800,
        48400,
        52200,
        56200,
        60400,
        64800,
        69400,
        74200,
        79200,
        84700,
        90700,
        97200,
        104200,
        111700,
        119700,
        128200,
        137200,
        146700,
        156700,
        167700,
        179700,
        192700,
        206700,
        221700,
        237700,
        254700,
        272700,
        291700,
        311700,
        333700,
        357700,
        383700,
        411700,
        441700,
        476700,
        516700,
        561700,
        611700,
        666700,
        726700,
        791700,
        861700,
        936700,
        1016700,
        1101700,
        1191700,
        1286700,
        1386700,
        1496700,
        1616700,
        1746700,
        1886700
    ],

    pet_level: (tier, exp) => {
        const rarityOffset = module.exports.pet_rarity_offset[tier.toLowerCase()];
        const levels = module.exports.pet_levels.slice(rarityOffset, rarityOffset + 99);

        const xpMaxLevel = levels.reduce((a, b) => a + b, 0)
        let xpTotal = 0;
        let level = 1;

        let xpForNext = Infinity;

        for(let i = 0; i < 100; i++){
            xpTotal += levels[i];

            if(xpTotal > exp){
                xpTotal -= levels[i];
                break;
            }else{
                level++;
            }
        }

        let xpCurrent = Math.floor(exp - xpTotal);
        let progress;

        if(level < 100){
            xpForNext = Math.ceil(levels[level - 1]);
            progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
        }else{
            level = 100;
            xpCurrent = exp - levels[99];
            xpForNext = 0;
            progress = 1;
        }

        return {
            level,
            xpCurrent,
            xpForNext,
            progress,
            xpMaxLevel
        };
    },

    pet_data: {
        "BAT": {
            head: "/head/382fc3f71b41769376a9e92fe3adbaac3772b999b219c9d6b4680ba9983e527",
            type: "mining",
            emoji: "🦇"
        },
        "BLAZE": {
            head: "/head/b78ef2e4cf2c41a2d14bfde9caff10219f5b1bf5b35a49eb51c6467882cb5f0",
            type: "combat",
            emoji: "🔥"
        },
        "CHICKEN": {
            head: "/head/7f37d524c3eed171ce149887ea1dee4ed399904727d521865688ece3bac75e",
            type: "farming",
            emoji: "🐔"
        },
        "HORSE": {
            head: "/head/36fcd3ec3bc84bafb4123ea479471f9d2f42d8fb9c5f11cf5f4e0d93226",
            type: "combat",
            emoji: "🐴"
        },
        "JERRY": {
            head: "/head/822d8e751c8f2fd4c8942c44bdb2f5ca4d8ae8e575ed3eb34c18a86e93b",
            type: "combat",
            emoji: "🧑"
        },
        "OCELOT": {
            head: "/head/5657cd5c2989ff97570fec4ddcdc6926a68a3393250c1be1f0b114a1db1",
            type: "foraging",
            emoji: "🐈"
        },
        "PIGMAN": {
            head: "/head/63d9cb6513f2072e5d4e426d70a5557bc398554c880d4e7b7ec8ef4945eb02f2",
            type: "combat",
            emoji: "🐷"
        },
        "RABBIT": {
            head: "/head/117bffc1972acd7f3b4a8f43b5b6c7534695b8fd62677e0306b2831574b",
            type: "farming",
            emoji: "🐇"
        },
        "SHEEP": {
            head: "/head/64e22a46047d272e89a1cfa13e9734b7e12827e235c2012c1a95962874da0",
            type: "alchemy",
            emoji: "🐑"
        },
        "SILVERFISH": {
            head: "/head/da91dab8391af5fda54acd2c0b18fbd819b865e1a8f1d623813fa761e924540",
            type: "mining",
            emoji: "🐛"
        },
        "WITHER_SKELETON": {
            head: "/head/f5ec964645a8efac76be2f160d7c9956362f32b6517390c59c3085034f050cff",
            type: "mining",
            emoji: "💀"
        },
        "SKELETON_HORSE": {
            head: "/head/47effce35132c86ff72bcae77dfbb1d22587e94df3cbc2570ed17cf8973a",
            type: "combat",
            emoji: "🐴"
        },
        "WOLF": {
            head: "/head/dc3dd984bb659849bd52994046964c22725f717e986b12d548fd169367d494",
            type: "combat",
            emoji: "🐺"
        },
        "ENDERMAN": {
            head: "/head/6eab75eaa5c9f2c43a0d23cfdce35f4df632e9815001850377385f7b2f039ce1",
            type: "combat",
            emoji: "🔮"
        },
        "PHOENIX": {
            head: "/head/23aaf7b1a778949696cb99d4f04ad1aa518ceee256c72e5ed65bfa5c2d88d9e",
            type: "combat",
            emoji: "🐦"
        },
        "MAGMA_CUBE": {
            head: "/head/38957d5023c937c4c41aa2412d43410bda23cf79a9f6ab36b76fef2d7c429",
            type: "combat",
            emoji: "🌋"
        },
        "FLYING_FISH": {
            head: "/head/40cd71fbbbbb66c7baf7881f415c64fa84f6504958a57ccdb8589252647ea",
            type: "fishing",
            emoji: "🐟"
        },
        "BLUE_WHALE": {
            head: "/head/dab779bbccc849f88273d844e8ca2f3a67a1699cb216c0a11b44326ce2cc20",
            type: "fishing",
            emoji: "🐋"
        },
        "TIGER": {
            head: "/head/fc42638744922b5fcf62cd9bf27eeab91b2e72d6c70e86cc5aa3883993e9d84",
            type: "combat",
            emoji: "🐯"
        },
        "LION": {
            head: "/head/38ff473bd52b4db2c06f1ac87fe1367bce7574fac330ffac7956229f82efba1",
            type: "foraging",
            emoji: "🦁"
        },
        "PARROT": {
            head: "/head/5df4b3401a4d06ad66ac8b5c4d189618ae617f9c143071c8ac39a563cf4e4208",
            type: "alchemy",
            emoji: "🦜"
        },
        "SNOWMAN": {
            head: "/head/11136616d8c4a87a54ce78a97b551610c2b2c8f6d410bc38b858f974b113b208",
            type: "combat",
            emoji: "⛄"
        },
        "TURTLE": {
            head: "/head/212b58c841b394863dbcc54de1c2ad2648af8f03e648988c1f9cef0bc20ee23c",
            type: "combat",
            emoji: "🐢"
        },
        "BEE": {
            head: "/head/7e941987e825a24ea7baafab9819344b6c247c75c54a691987cd296bc163c263",
            type: "farming",
            emoji: "🐝"
        },
        "ENDER_DRAGON": {
            head: "/head/aec3ff563290b13ff3bcc36898af7eaa988b6cc18dc254147f58374afe9b21b9",
            type: "combat",
            emoji: "🐲"
        },
        "GUARDIAN": {
            head: "/head/221025434045bda7025b3e514b316a4b770c6faa4ba9adb4be3809526db77f9d",
            type: "combat",
            emoji: "🐡"
        },
        "SQUID": {
            head: "/head/01433be242366af126da434b8735df1eb5b3cb2cede39145974e9c483607bac",
            type: "fishing",
            emoji: "🦑"
        },
        "GIRAFFE": {
            head: "/head/176b4e390f2ecdb8a78dc611789ca0af1e7e09229319c3a7aa8209b63b9",
            type: "foraging",
            emoji: "🦒"
        },
        "ELEPHANT": {
            head: "/head/7071a76f669db5ed6d32b48bb2dba55d5317d7f45225cb3267ec435cfa514",
            type: "farming",
            emoji: "🐘"
        },
        "MONKEY": {
            head: "/head/13cf8db84807c471d7c6922302261ac1b5a179f96d1191156ecf3e1b1d3ca",
            type: "foraging",
            emoji: "🐒"
        },
        "SPIDER": {
            head: "/head/cd541541daaff50896cd258bdbdd4cf80c3ba816735726078bfe393927e57f1",
            type: "combat",
            emoji: "🕷️"
        },
        "ENDERMITE": {
            head: "/head/5a1a0831aa03afb4212adcbb24e5dfaa7f476a1173fce259ef75a85855",
            type: "mining",
            emoji: "🐛"
        },
        "GHOUL": {
            head: "/head/87934565bf522f6f4726cdfe127137be11d37c310db34d8c70253392b5ff5b",
            type: "combat",
            emoji: "🧟"
        },
        "JELLYFISH": {
            head: "/head/913f086ccb56323f238ba3489ff2a1a34c0fdceeafc483acff0e5488cfd6c2f1",
            type: "alchemy",
            emoji: "🎐"
        },
        "PIG": {
            head: "/head/621668ef7cb79dd9c22ce3d1f3f4cb6e2559893b6df4a469514e667c16aa4",
            type: "farming",
            emoji: "🐷"
        },
        "ROCK": {
            head: "/head/cb2b5d48e57577563aca31735519cb622219bc058b1f34648b67b8e71bc0fa",
            type: "mining",
            emoji: "🗿"
        },
        "SKELETON": {
            head: "/head/fca445749251bdd898fb83f667844e38a1dff79a1529f79a42447a0599310ea4",
            type: "combat",
            emoji: "💀"
        },
        "ZOMBIE": {
            head: "/head/56fc854bb84cf4b7697297973e02b79bc10698460b51a639c60e5e417734e11",
            type: "combat",
            emoji: "🧟"
        },
        "DOLPHIN": {
            head: "/head/cefe7d803a45aa2af1993df2544a28df849a762663719bfefc58bf389ab7f5",
            type: "fishing",
            emoji: "🐬"
        },
        "BABY_YETI": {
            head: "/head/ab126814fc3fa846dad934c349628a7a1de5b415021a03ef4211d62514d5",
            type: "fishing",
            emoji: "❄️"
        },
        "GOLEM": {
            head: "/head/89091d79ea0f59ef7ef94d7bba6e5f17f2f7d4572c44f90f76c4819a714",
            type: "combat",
            emoji: "🗿"
        },
        "HOUND": {
            head: "/head/b7c8bef6beb77e29af8627ecdc38d86aa2fea7ccd163dc73c00f9f258f9a1457",
            type: "combat",
            emoji: "👹"
        },
        "TARANTULA": {
            head: "/head/8300986ed0a04ea79904f6ae53f49ed3a0ff5b1df62bba622ecbd3777f156df8",
            type: "combat",
            emoji: "🕸️"
        },
        "BLACK_CAT": {
            head: "/head/e4b45cbaa19fe3d68c856cd3846c03b5f59de81a480eec921ab4fa3cd81317",
            type: "combat",
            emoji: "🐱"
        },
        "SPIRIT": {
            head: "/head/8d9ccc670677d0cebaad4058d6aaf9acfab09abea5d86379a059902f2fe22655",
            type: "combat",
            emoji: "👻"
        },
        "GRIFFIN": {
            head: "/head/4c27e3cb52a64968e60c861ef1ab84e0a0cb5f07be103ac78da67761731f00c8",
            type: "combat",
            emoji: "🦅"
        },
        "MEGALODON": {
            head: "/head/a94ae433b301c7fb7c68cba625b0bd36b0b14190f20e34a7c8ee0d9de06d53b9",
            type: "fishing",
            emoji: "🦈"
        },
        "MITHRIL_GOLEM": {
            head: "/head/c1b2dfe8ed5dffc5b1687bc1c249c39de2d8a6c3d90305c95f6d1a1a330a0b1",
            type: "mining",
            emoji: "🗿"
        },
        "GRANDMA_WOLF": {
            head: "/head/4e794274c1bb197ad306540286a7aa952974f5661bccf2b725424f6ed79c7884",
            type: "combat",
            emoji: "👵"
        },
        "RAT": {
            head: "/head/a8abb471db0ab78703011979dc8b40798a941f3a4dec3ec61cbeec2af8cffe8",
            type: "combat",
            emoji: "🐀"
        },
        "BAL": {
            head: "/head/c469ba2047122e0a2de3c7437ad3dd5d31f1ac2d27abde9f8841e1d92a8c5b75",
            type: "combat",
            emoji: "🔥"
        },
        "SCATHA": {
            head: "/head/df03ad96092f3f789902436709cdf69de6b727c121b3c2daef9ffa1ccaed186c",
            type: "mining",
            emoji: "🪱"
        },
        "GOLDEN_DRAGON": {
            head: "/head/2e9f9b1fc014166cb46a093e5349b2bf6edd201b680d62e48dbf3af9b0459116",
            type: "combat",
            emoji: "🐉"
        },
        "AMMONITE": {
            head: "/head/a074a7bd976fe6aba1624161793be547d54c835cf422243a851ba09d1e650553",
            type: "fishing",
            emoji: "🐌"
        },
        "ARMADILLO": {
            head: "/head/c1eb6df4736ae24dd12a3d00f91e6e3aa7ade6bbefb0978afef2f0f92461018f",
            type: "mining",
            emoji: "🐢"
        },
    },

    pet_value: {
        "common": 1,
        "uncommon": 2,
        "rare": 3,
        "epic": 4,
        "legendary": 5,
        "mythic": 6
    },

    pet_rarity_boost_items: [
        'PET_ITEM_TIER_BOOST', 
        'PET_ITEM_VAMPIRE_FANG', 
        'PET_ITEM_TOY_JERRY'
    ],

    pet_rewards: {
        0: {
            magic_find: 0
        },
        10: {
            magic_find: 1
        },
        25: {
            magic_find: 2
        },
        50: {
            magic_find: 3
        },
        75: {
            magic_find: 4
        },
        100: {
            magic_find: 5
        },
        130: {
            magic_find: 6
        },
        175: {
            magic_find: 7
        }
    },

    pet_items: {
        PET_ITEM_ALL_SKILLS_BOOST_COMMON: {
            description: "§7Gives +§a10% §7pet exp for all skills"
        },
        PET_ITEM_BIG_TEETH_COMMON: {
            description: "§7Increases §9Crit Chance §7by §a5%",
            stats: {
                crit_chance: 5
            }
        },
        PET_ITEM_IRON_CLAWS_COMMON: {
            description: "§7Increases the pet's §9Crit Damage §7by §a40% §7and §9Crit Chance §7by §a40%"
        },
        PET_ITEM_SHARPENED_CLAWS_UNCOMMON: {
            description: "§7Increases §9Crit Damage §7by §a15%",
            stats: {
                crit_damage: 15
            }
        },
        PET_ITEM_HARDENED_SCALES_UNCOMMON: {
            description: "§7Increases §aDefense §7by §a25",
            stats: {
                defense: 25
            }
        },
        PET_ITEM_BUBBLEGUM: {
            description: "§7Your pet fuses its power with placed §aOrbs §7to give them §a2x §7duration"
        },
        PET_ITEM_LUCKY_CLOVER: {
            description: "§7Increases §bMagic Find §7by §a7",
            stats: {
                magic_find: 7
            }
        },
        PET_ITEM_TEXTBOOK: {
            description: "§7Increases the pet's §bIntelligence §7by §a100%"
        },
        PET_ITEM_SADDLE: {
            description: "§7Increase horse speed by §a50% §7 and jump boost by §a100%"
        },
        PET_ITEM_EXP_SHARE: {
            description: "§7While unequipped this pet gains §a25% §7of the equipped pet's xp, this is §7split between all pets holding the item."
        },
        PET_ITEM_TIER_BOOST: {
            description: "§7Boosts the §ararity §7of your pet by 1 tier!"
        },
        PET_ITEM_COMBAT_SKILL_BOOST_COMMON: {
            description: "§7Gives +§a20% §7pet exp for Combat"
        },
        PET_ITEM_COMBAT_SKILL_BOOST_UNCOMMON: {
            description: "§7Gives +§a30% §7pet exp for Combat"
        },
        PET_ITEM_COMBAT_SKILL_BOOST_RARE: {
            description: "§7Gives +§a40% §7pet exp for Combat"
        },
        PET_ITEM_COMBAT_SKILL_BOOST_EPIC: {
            description: "§7Gives +§a50% §7pet exp for Combat"
        },
        PET_ITEM_FISHING_SKILL_BOOST_COMMON: {
            description: "§7Gives +§a20% §7pet exp for Fishing"
        },
        PET_ITEM_FISHING_SKILL_BOOST_UNCOMMON: {
            description: "§7Gives +§a30% §7pet exp for Fishing"
        },
        PET_ITEM_FISHING_SKILL_BOOST_RARE: {
            description: "§7Gives +§a40% §7pet exp for Fishing"
        },
        PET_ITEM_FISHING_SKILL_BOOST_EPIC: {
            description: "§7Gives +§a50% §7pet exp for Fishing"
        },
        PET_ITEM_FORAGING_SKILL_BOOST_COMMON: {
            description: "§7Gives +§a20% §7pet exp for Foraging"
        },
        PET_ITEM_FORAGING_SKILL_BOOST_UNCOMMON: {
            description: "§7Gives +§a30% §7pet exp for Foraging"
        },
        PET_ITEM_FORAGING_SKILL_BOOST_RARE: {
            description: "§7Gives +§a40% §7pet exp for Foraging"
        },
        PET_ITEM_FORAGING_SKILL_BOOST_EPIC: {
            description: "§7Gives +§a50% §7pet exp for Foraging"
        },
        PET_ITEM_MINING_SKILL_BOOST_COMMON: {
            description: "§7Gives +§a20% §7pet exp for Mining"
        },
        PET_ITEM_MINING_SKILL_BOOST_UNCOMMON: {
            description: "§7Gives +§a30% §7pet exp for Mining"
        },
        PET_ITEM_MINING_SKILL_BOOST_RARE: {
            description: "§7Gives +§a40% §7pet exp for Mining"
        },
        PET_ITEM_MINING_SKILL_BOOST_EPIC: {
            description: "§7Gives +§a50% §7pet exp for Mining"
        },
        PET_ITEM_FARMING_SKILL_BOOST_COMMON: {
            description: "§7Gives +§a20% §7pet exp for Farming"
        },
        PET_ITEM_FARMING_SKILL_BOOST_UNCOMMON: {
            description: "§7Gives +§a30% §7pet exp for Farming"
        },
        PET_ITEM_FARMING_SKILL_BOOST_RARE: {
            description: "§7Gives +§a40% §7pet exp for Farming"
        },
        PET_ITEM_FARMING_SKILL_BOOST_EPIC: {
            description: "§7Gives +§a50% §7pet exp for Farming"
        }
    }
}
