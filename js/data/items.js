const ITEMS = [
    { 
        id: 'health_potion', 
        name: '生命药水', 
        icon: '🧪', 
        type: 'consumable', 
        effect: { hp: 30 }, 
        desc: '恢复30点生命' 
    },
    { 
        id: 'stamina_potion', 
        name: '体力药水', 
        icon: '⚡', 
        type: 'consumable', 
        effect: { stamina: 25 }, 
        desc: '恢复25点体力' 
    },
    { 
        id: 'incense', 
        name: '香火', 
        icon: '🕯️', 
        type: 'currency', 
        desc: '用于供奉神明' 
    },
    { 
        id: 'gold', 
        name: '金币', 
        icon: '💰', 
        type: 'currency', 
        desc: '通用货币' 
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ITEMS;
}
