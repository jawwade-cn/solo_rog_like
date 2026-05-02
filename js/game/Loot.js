class Loot {
    static handleChest(chest, player) {
        let lootMessage = '';
        
        switch (chest.type) {
            case 'equipment':
                player.addItemToInventory(chest.item, 1);
                lootMessage = `获得装备: ${chest.item.icon} ${chest.item.name}`;
                break;
                
            case 'incense':
                player.incense += chest.amount;
                lootMessage = `获得 🕯️ ${chest.amount} 香火`;
                break;
                
            case 'gold':
                player.gold += chest.amount;
                lootMessage = `获得 💰 ${chest.amount} 金币`;
                break;
                
            case 'potion':
                player.addItemToInventory(chest.item, chest.quantity);
                lootMessage = `获得 ${chest.item.icon} ${chest.quantity}x ${chest.item.name}`;
                break;
        }
        
        return lootMessage;
    }
    
    static handleSupply(supply, player) {
        let message = '';
        
        switch (supply.type) {
            case 'full_restore':
                player.hp = player.maxHp;
                player.stamina = player.maxStamina;
                message = '完全恢复了生命和体力！';
                break;
                
            case 'health':
                const healAmount = 30;
                player.hp = Math.min(player.maxHp, player.hp + healAmount);
                message = `恢复了 ${healAmount} 点生命`;
                break;
                
            case 'stamina':
                const staminaAmount = 30;
                player.stamina = Math.min(player.maxStamina, player.stamina + staminaAmount);
                message = `恢复了 ${staminaAmount} 点体力`;
                break;
        }
        
        return message;
    }
    
    static findSmallGold() {
        return 1 + Math.floor(Math.random() * 5);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Loot;
}
