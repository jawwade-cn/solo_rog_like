class Player {
    constructor() {
        this.init();
    }
    
    init() {
        this.x = 5;
        this.y = 5;
        this.hp = 100;
        this.maxHp = 100;
        this.stamina = 100;
        this.maxStamina = 100;
        this.baseAttack = 5;
        this.baseDefense = 2;
        this.attack = 5;
        this.defense = 2;
        this.moveSpeed = 1;
        this.moveCostReduction = 0;
        this.critChance = 0.05;
        this.critDamage = 1.5;
        this.damageMultiplier = 1;
        this.staminaRegen = 1;
        this.hpRegenPerTurn = 0;
        this.incense = 10;
        this.gold = 0;
        this.inventory = [];
        this.equipment = {
            weapon: null,
            armor: null,
            boots: null,
            accessory: null
        };
        this.unlockedGods = [];
    }
    
    updateStats() {
        this.attack = this.baseAttack;
        this.defense = this.baseDefense;
        this.moveSpeed = 1;
        
        Object.values(this.equipment).forEach(eq => {
            if (eq) {
                if (eq.attack) this.attack += eq.attack;
                if (eq.defense) this.defense += eq.defense;
                if (eq.moveSpeed) this.moveSpeed += eq.moveSpeed;
            }
        });
    }
    
    applyGodBlessing(god) {
        const effect = god.effect;
        
        if (effect.maxStamina) {
            this.maxStamina += effect.maxStamina;
            this.stamina = this.maxStamina;
        }
        if (effect.baseAttack) {
            this.baseAttack += effect.baseAttack;
        }
        if (effect.staminaRegen) {
            this.staminaRegen *= (1 + effect.staminaRegen);
        }
        if (effect.baseDefense) {
            this.baseDefense += effect.baseDefense;
        }
        if (effect.maxHp) {
            this.maxHp += effect.maxHp;
            this.hp = this.maxHp;
        }
        if (effect.damageMultiplier) {
            this.damageMultiplier += effect.damageMultiplier;
        }
        if (effect.critChance) {
            this.critChance += effect.critChance;
        }
        if (effect.hpRegenPerTurn) {
            this.hpRegenPerTurn += effect.hpRegenPerTurn;
        }
        if (effect.critDamage) {
            this.critDamage += effect.critDamage;
        }
        if (effect.moveCostReduction) {
            this.moveCostReduction += effect.moveCostReduction;
        }
        
        this.updateStats();
    }
    
    getMoveCost() {
        return Math.floor(10 * (1 - this.moveCostReduction));
    }
    
    consumeStamina() {
        const cost = this.getMoveCost();
        if (this.stamina >= cost) {
            this.stamina -= cost;
            return true;
        }
        return false;
    }
    
    regenerateStamina() {
        this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRegen);
    }
    
    regenerateHp() {
        if (this.hpRegenPerTurn > 0) {
            this.hp = Math.min(this.maxHp, this.hp + this.hpRegenPerTurn);
        }
    }
    
    equipItem(item, inventoryIndex) {
        const oldEquip = this.equipment[item.slot];
        
        this.equipment[item.slot] = { ...item };
        
        this.inventory.splice(inventoryIndex, 1);
        
        if (oldEquip) {
            this.inventory.push({ ...oldEquip, quantity: 1 });
        }
        
        this.updateStats();
        return oldEquip;
    }
    
    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) return null;
        
        this.inventory.push({ ...item, quantity: 1 });
        this.equipment[slot] = null;
        this.updateStats();
        return item;
    }
    
    useItem(inventoryIndex) {
        const item = this.inventory[inventoryIndex];
        if (!item || item.type !== 'consumable') return false;
        
        let used = false;
        
        if (item.effect && item.effect.hp) {
            this.hp = Math.min(this.maxHp, this.hp + item.effect.hp);
            used = true;
        }
        if (item.effect && item.effect.stamina) {
            this.stamina = Math.min(this.maxStamina, this.stamina + item.effect.stamina);
            used = true;
        }
        
        if (used) {
            item.quantity--;
            if (item.quantity <= 0) {
                this.inventory.splice(inventoryIndex, 1);
            }
        }
        
        return used;
    }
    
    addItemToInventory(item, quantity = 1) {
        const existingItem = this.inventory.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.inventory.push({ ...item, quantity });
        }
    }
    
    isAlive() {
        return this.hp > 0;
    }
    
    hasStamina() {
        return this.stamina >= this.getMoveCost();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}
