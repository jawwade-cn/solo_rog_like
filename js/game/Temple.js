class Temple {
    constructor(god) {
        this.god = god;
    }
    
    canOffer(player, unlockedGods) {
        if (unlockedGods.has(this.god.id)) {
            return false;
        }
        return player.incense >= this.god.offeringCost;
    }
    
    isAlreadyOffered(unlockedGods) {
        return unlockedGods.has(this.god.id);
    }
    
    offer(player, unlockedGods) {
        if (!this.canOffer(player, unlockedGods)) {
            return { success: false, message: '香火不足或已供奉过此神明' };
        }
        
        player.incense -= this.god.offeringCost;
        unlockedGods.add(this.god.id);
        
        if (!player.unlockedGods.includes(this.god.id)) {
            player.unlockedGods.push(this.god.id);
        }
        
        player.applyGodBlessing(this.god);
        
        return {
            success: true,
            god: this.god,
            message: `${this.god.name} 接受了你的供奉！`
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Temple;
}
