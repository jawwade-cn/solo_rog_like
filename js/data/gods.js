const GODS = [
    { 
        id: 'nvwang', 
        name: '女娲', 
        icon: '👩', 
        title: '创世女神', 
        blessing: '最大体力 +20', 
        effect: { maxStamina: 20 }, 
        offeringCost: 30 
    },
    { 
        id: 'fuxi', 
        name: '伏羲', 
        icon: '👨', 
        title: '八卦始祖', 
        blessing: '攻击力 +3', 
        effect: { baseAttack: 3 }, 
        offeringCost: 35 
    },
    { 
        id: 'shennong', 
        name: '神农', 
        icon: '🌿', 
        title: '药祖', 
        blessing: '体力恢复速度 +50%', 
        effect: { staminaRegen: 0.5 }, 
        offeringCost: 25 
    },
    { 
        id: 'xuanyuan', 
        name: '黄帝', 
        icon: '👑', 
        title: '轩辕氏', 
        blessing: '防御力 +2，最大生命 +10', 
        effect: { baseDefense: 2, maxHp: 10 }, 
        offeringCost: 40 
    },
    { 
        id: 'chiyou', 
        name: '蚩尤', 
        icon: '👹', 
        title: '兵主战神', 
        blessing: '战斗伤害 +20%', 
        effect: { damageMultiplier: 0.2 }, 
        offeringCost: 45 
    },
    { 
        id: 'xiwangmu', 
        name: '西王母', 
        icon: '👸', 
        title: '昆仑之主', 
        blessing: '暴击率 +10%', 
        effect: { critChance: 0.1 }, 
        offeringCost: 35 
    },
    { 
        id: 'gonggong', 
        name: '共工', 
        icon: '🌊', 
        title: '水神', 
        blessing: '每回合恢复 5 生命', 
        effect: { hpRegenPerTurn: 5 }, 
        offeringCost: 30 
    },
    { 
        id: 'zhurong', 
        name: '祝融', 
        icon: '🔥', 
        title: '火神', 
        blessing: '攻击力 +5，防御 -1', 
        effect: { baseAttack: 5, baseDefense: -1 }, 
        offeringCost: 30 
    },
    { 
        id: 'houyi', 
        name: '后羿', 
        icon: '🏹', 
        title: '射日英雄', 
        blessing: '暴击伤害 +50%', 
        effect: { critDamage: 0.5 }, 
        offeringCost: 35 
    },
    { 
        id: 'chang_e', 
        name: '嫦娥', 
        icon: '🌙', 
        title: '月宫仙子', 
        blessing: '移动消耗体力 -20%', 
        effect: { moveCostReduction: 0.2 }, 
        offeringCost: 25 
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GODS;
}
