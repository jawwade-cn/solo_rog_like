const EQUIPMENT = [
    { 
        id: 'sword_wood', 
        name: '桃木剑', 
        icon: '🗡️', 
        slot: 'weapon', 
        attack: 3, 
        desc: '基础武器，驱邪之用' 
    },
    { 
        id: 'sword_iron', 
        name: '铁剑', 
        icon: '⚔️', 
        slot: 'weapon', 
        attack: 6, 
        desc: '普通铁剑，锋利耐用' 
    },
    { 
        id: 'sword_gold', 
        name: '轩辕剑', 
        icon: '🌟', 
        slot: 'weapon', 
        attack: 12, 
        desc: '传说中的神器，威力无穷' 
    },
    { 
        id: 'spear', 
        name: '戈', 
        icon: '🔱', 
        slot: 'weapon', 
        attack: 5, 
        desc: '古代兵器，适合突刺' 
    },
    { 
        id: 'bow', 
        name: '弓', 
        icon: '🏹', 
        slot: 'weapon', 
        attack: 4, 
        desc: '远程武器，先发制人' 
    },
    { 
        id: 'armor_cloth', 
        name: '布甲', 
        icon: '👕', 
        slot: 'armor', 
        defense: 2, 
        desc: '轻便防具' 
    },
    { 
        id: 'armor_leather', 
        name: '皮甲', 
        icon: '🦺', 
        slot: 'armor', 
        defense: 4, 
        desc: '兽皮制成的防具' 
    },
    { 
        id: 'armor_iron', 
        name: '铁甲', 
        icon: '🛡️', 
        slot: 'armor', 
        defense: 7, 
        desc: '坚固的金属防具' 
    },
    { 
        id: 'armor_gold', 
        name: '黄金甲', 
        icon: '✨', 
        slot: 'armor', 
        defense: 10, 
        desc: '华贵的防具，防御极高' 
    },
    { 
        id: 'boots_cloth', 
        name: '布鞋', 
        icon: '👟', 
        slot: 'boots', 
        moveSpeed: 1, 
        desc: '普通鞋子' 
    },
    { 
        id: 'boots_leather', 
        name: '皮靴', 
        icon: '🥾', 
        slot: 'boots', 
        moveSpeed: 2, 
        desc: '轻便的靴子' 
    },
    { 
        id: 'boots_wind', 
        name: '风火轮', 
        icon: '🔥', 
        slot: 'boots', 
        moveSpeed: 4, 
        desc: '哪吒的法宝，移动如风' 
    },
    { 
        id: 'ring_str', 
        name: '力量戒指', 
        icon: '💍', 
        slot: 'accessory', 
        attack: 2, 
        desc: '蕴含力量的戒指' 
    },
    { 
        id: 'ring_def', 
        name: '守护戒指', 
        icon: '💎', 
        slot: 'accessory', 
        defense: 2, 
        desc: '提供保护的戒指' 
    },
    { 
        id: 'ring_speed', 
        name: '疾风戒指', 
        icon: '🌪️', 
        slot: 'accessory', 
        moveSpeed: 1, 
        desc: '提升移动速度' 
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EQUIPMENT;
}
