class Battle {
    constructor(player, monster) {
        this.player = player;
        this.monster = { ...monster };
        this.turn = 0;
        this.log = [];
        this.result = BattleResult.ONGOING;
    }
    
    playerAttack() {
        this.turn++;
        
        let playerDamage = Math.max(1, this.player.attack - this.monster.defense);
        const isCrit = Math.random() < this.player.critChance;
        
        if (isCrit) {
            playerDamage = Math.floor(playerDamage * this.player.critDamage);
        }
        
        playerDamage = Math.floor(playerDamage * this.player.damageMultiplier);
        this.monster.hp -= playerDamage;
        
        let playerMsg = `你造成了 ${playerDamage} 点伤害`;
        if (isCrit) playerMsg += ' (暴击！)';
        this.log.push(playerMsg);
        
        if (this.monster.hp <= 0) {
            this.result = BattleResult.PLAYER_WIN;
            return this.result;
        }
        
        this.monsterAttack();
        
        return this.result;
    }
    
    monsterAttack() {
        const monsterDamage = Math.max(1, this.monster.attack - this.player.defense);
        this.player.hp -= monsterDamage;
        this.log.push(`${this.monster.name} 对你造成了 ${monsterDamage} 点伤害`);
        
        if (this.player.hp <= 0) {
            this.result = BattleResult.PLAYER_LOSE;
        }
    }
    
    playerDefend() {
        this.turn++;
        
        const reducedDefense = this.player.defense * 2;
        const monsterDamage = Math.max(1, this.monster.attack - reducedDefense);
        this.player.hp -= monsterDamage;
        this.log.push(`你采取防御姿态，${this.monster.name} 只造成了 ${monsterDamage} 点伤害`);
        
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.floor(this.player.defense * 0.5));
        
        if (this.player.hp <= 0) {
            this.result = BattleResult.PLAYER_LOSE;
        }
        
        return this.result;
    }
    
    tryFlee() {
        const fleeChance = 0.4 + (this.player.moveSpeed * 0.1);
        
        if (Math.random() < fleeChance) {
            this.log.push('你成功逃跑了！');
            this.result = BattleResult.FLEE;
            return true;
        } else {
            this.turn++;
            this.log.push('逃跑失败！');
            this.monsterAttack();
            return false;
        }
    }
    
    isOngoing() {
        return this.result === BattleResult.ONGOING;
    }
    
    getMonsterHpPercent() {
        return (this.monster.hp / this.monster.maxHp) * 100;
    }
    
    getPlayerHpPercent() {
        return (this.player.hp / this.player.maxHp) * 100;
    }
    
    getReward() {
        if (this.result === BattleResult.PLAYER_WIN) {
            return this.monster.reward;
        }
        return null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Battle };
}
