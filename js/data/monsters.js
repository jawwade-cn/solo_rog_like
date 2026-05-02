const MONSTERS = [
    { 
        id: 'demon_fox', 
        name: '九尾狐', 
        icon: '🦊', 
        title: '青丘之狐', 
        hp: 30, 
        attack: 8, 
        defense: 3, 
        reward: { gold: 20, incense: 5 } 
    },
    { 
        id: 'dragon', 
        name: '应龙', 
        icon: '🐉', 
        title: '助禹治水之龙', 
        hp: 50, 
        attack: 12, 
        defense: 5, 
        reward: { gold: 40, incense: 10 } 
    },
    { 
        id: 'phoenix', 
        name: '凤凰', 
        icon: '🐦', 
        title: '不死之鸟', 
        hp: 35, 
        attack: 10, 
        defense: 4, 
        reward: { gold: 30, incense: 8 } 
    },
    { 
        id: 'qilin', 
        name: '麒麟', 
        icon: '🦄', 
        title: '瑞兽', 
        hp: 45, 
        attack: 11, 
        defense: 6, 
        reward: { gold: 35, incense: 12 } 
    },
    { 
        id: 'tiger', 
        name: '白虎', 
        icon: '🐯', 
        title: '西方神兽', 
        hp: 40, 
        attack: 14, 
        defense: 4, 
        reward: { gold: 32, incense: 9 } 
    },
    { 
        id: 'tortoise', 
        name: '玄武', 
        icon: '🐢', 
        title: '北方神兽', 
        hp: 60, 
        attack: 8, 
        defense: 10, 
        reward: { gold: 38, incense: 11 } 
    },
    { 
        id: 'snake', 
        name: '巴蛇', 
        icon: '🐍', 
        title: '食象之蛇', 
        hp: 25, 
        attack: 9, 
        defense: 2, 
        reward: { gold: 15, incense: 4 } 
    },
    { 
        id: 'pig', 
        name: '封豕', 
        icon: '🐗', 
        title: '大野猪', 
        hp: 28, 
        attack: 10, 
        defense: 3, 
        reward: { gold: 18, incense: 5 } 
    },
    { 
        id: 'bird', 
        name: '毕方', 
        icon: '🔥', 
        title: '火鸟', 
        hp: 22, 
        attack: 11, 
        defense: 2, 
        reward: { gold: 16, incense: 6 } 
    },
    { 
        id: 'fish', 
        name: '文鳐鱼', 
        icon: '🐟', 
        title: '飞鱼', 
        hp: 18, 
        attack: 7, 
        defense: 3, 
        reward: { gold: 12, incense: 3 } 
    },
    { 
        id: 'wolf', 
        name: '犲狼', 
        icon: '🐺', 
        title: '凶兽', 
        hp: 24, 
        attack: 9, 
        defense: 2, 
        reward: { gold: 14, incense: 4 } 
    },
    { 
        id: 'bear', 
        name: '熊罴', 
        icon: '🐻', 
        title: '山中巨兽', 
        hp: 32, 
        attack: 10, 
        defense: 5, 
        reward: { gold: 22, incense: 6 } 
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MONSTERS;
}
