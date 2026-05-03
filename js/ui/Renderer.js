class Renderer {
    static renderAll(game) {
        this.renderStats(game);
        this.renderMap(game);
        this.renderLogs(game);
        this.renderInventory(game);
        this.renderEquipment(game);
        this.renderGods(game);
        this.renderPlayerStats(game);
    }
    
    static renderStats(game) {
        document.getElementById('floor-num').textContent = game.currentFloor;
        document.getElementById('stamina-value').textContent = 
            `${Math.floor(game.player.stamina)}/${game.player.maxStamina}`;
        document.getElementById('stamina-bar').style.width = 
            `${(game.player.stamina / game.player.maxStamina) * 100}%`;
        document.getElementById('incense-value').textContent = game.player.incense;
        document.getElementById('gold-value').textContent = game.player.gold;
    }
    
    static renderMap(game) {
        const grid = document.getElementById('map-grid');
        const mapSize = game.map.size;
        
        grid.style.gridTemplateColumns = `repeat(${mapSize}, 40px)`;
        grid.innerHTML = '';
        
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const cell = game.map.getCell(x, y);
                const div = document.createElement('div');
                div.className = 'map-cell';
                
                let icon = '';
                let cellClass = '';
                let tooltip = '';
                
                if (x === game.player.x && y === game.player.y) {
                    icon = '🧙';
                    cellClass = 'player';
                    tooltip = '你';
                } else if (!cell.explored) {
                    if (cell.type === 'locked') {
                        icon = '❓';
                        cellClass = 'locked';
                        tooltip = `未探索 (消耗${game.player.getMoveCost()}体力)`;
                    } else {
                        icon = '🌑';
                        cellClass = 'chaos';
                        tooltip = '混沌';
                    }
                } else {
                    cellClass = 'explored';
                    switch (cell.contentType) {
                        case 'monster':
                            icon = cell.content ? cell.content.icon : '👹';
                            tooltip = cell.content ? `${cell.content.name} (战斗)` : '空';
                            break;
                        case 'temple':
                            icon = '🛕';
                            tooltip = cell.content ? `${cell.content.name} 的神庙` : '空神庙';
                            break;
                        case 'chest':
                            icon = '📦';
                            tooltip = '宝箱';
                            break;
                        case 'supply':
                            icon = '🏕️';
                            tooltip = '补给点';
                            break;
                        case 'exit':
                            icon = '🚪';
                            cellClass = 'exit';
                            tooltip = '出口 (进入下一层)';
                            break;
                        default:
                            icon = '🌿';
                            tooltip = '已探索';
                    }
                }
                
                if (cellClass) {
                    div.classList.add(cellClass);
                }
                
                const canMove = game.map.canMoveTo(x, y, game.player) && game.state === GameState.PLAYING;
                if (canMove) {
                    div.classList.add('can-move');
                    div.onclick = () => game.moveTo(x, y);
                }
                
                div.innerHTML = `${icon}<div class="cell-tooltip">${tooltip}</div>`;
                grid.appendChild(div);
            }
        }
    }
    
    static renderLogs(game) {
        const content = document.getElementById('log-content');
        content.innerHTML = game.logs.slice(0, 10).map(log => 
            `<div class="log-entry ${log.type}">${log.message}</div>`
        ).join('');
    }
    
    static renderInventory(game) {
        const content = document.getElementById('inventory-content');
        const consumables = game.player.inventory.filter(i => i.type === 'consumable');
        const equipment = game.player.inventory.filter(i => i.slot);
        
        let html = '';
        
        if (consumables.length > 0) {
            html += '<div style="margin-bottom: 10px;"><strong style="color: #feca57;">消耗品</strong></div>';
            consumables.forEach((item, idx) => {
                const actualIdx = game.player.inventory.indexOf(item);
                html += `
                    <div class="item-slot" onclick="game.useItem(${actualIdx})">
                        <div class="item-icon">${item.icon}</div>
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-desc">${item.desc}</div>
                        </div>
                        <div class="item-quantity">x${item.quantity}</div>
                    </div>
                `;
            });
        }
        
        if (equipment.length > 0) {
            html += '<div style="margin-bottom: 10px; margin-top: 15px;"><strong style="color: #feca57;">装备</strong></div>';
            equipment.forEach((item, idx) => {
                const actualIdx = game.player.inventory.indexOf(item);
                let stats = [];
                if (item.attack) stats.push(`攻击+${item.attack}`);
                if (item.defense) stats.push(`防御+${item.defense}`);
                if (item.moveSpeed) stats.push(`移速+${item.moveSpeed}`);
                
                html += `
                    <div class="item-slot" onclick="game.equipItem(${actualIdx})">
                        <div class="item-icon">${item.icon}</div>
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-desc">${stats.join(', ') || item.desc}</div>
                        </div>
                    </div>
                `;
            });
        }
        
        if (html === '') {
            html = '<div style="color: #666; text-align: center; padding: 20px;">背包为空</div>';
        }
        
        content.innerHTML = html;
    }
    
    static renderEquipment(game) {
        const content = document.getElementById('equipment-content');
        const slots = [
            { key: 'weapon', name: '武器' },
            { key: 'armor', name: '护甲' },
            { key: 'boots', name: '鞋子' },
            { key: 'accessory', name: '饰品' }
        ];
        
        let html = '';
        
        slots.forEach(slot => {
            const item = game.player.equipment[slot.key];
            if (item) {
                let stats = [];
                if (item.attack) stats.push(`攻击+${item.attack}`);
                if (item.defense) stats.push(`防御+${item.defense}`);
                if (item.moveSpeed) stats.push(`移速+${item.moveSpeed}`);
                
                html += `
                    <div class="item-slot" onclick="game.unequipItem('${slot.key}')">
                        <div class="item-icon">${item.icon}</div>
                        <div class="item-info">
                            <div class="item-name">${item.name} (${slot.name})</div>
                            <div class="item-desc">${stats.join(', ') || item.desc}</div>
                        </div>
                        <div style="color: #999; font-size: 11px;">点击卸下</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="item-slot" style="opacity: 0.5;">
                        <div class="item-icon">➖</div>
                        <div class="item-info">
                            <div class="item-name">${slot.name}</div>
                            <div class="item-desc">空</div>
                        </div>
                    </div>
                `;
            }
        });
        
        content.innerHTML = html;
    }
    
    static renderGods(game) {
        const content = document.getElementById('gods-content');
        let html = '';
        
        GODS.forEach(god => {
            const isUnlocked = game.unlockedGods.has(god.id);
            html += `
                <div class="god-card ${isUnlocked ? 'offering' : ''}">
                    <div class="god-icon">${god.icon}</div>
                    <div class="god-info">
                        <div class="god-name">${god.name}</div>
                        <div class="god-title">${god.title}</div>
                        <div class="god-blessing">✨ ${god.blessing}</div>
                        ${isUnlocked ? 
                            '<div class="god-faith" style="color: #1dd1a1;">✓ 已获得祝福</div>' : 
                            `<div class="god-faith">🕯️ 供奉需要: ${god.offeringCost} 香火</div>`
                        }
                    </div>
                </div>
            `;
        });
        
        content.innerHTML = html;
    }
    
    static renderPlayerStats(game) {
        const content = document.getElementById('stats-content');
        const stats = [
            { label: '生命值', value: `${game.player.hp}/${game.player.maxHp}` },
            { label: '体力值', value: `${Math.floor(game.player.stamina)}/${game.player.maxStamina}` },
            { label: '攻击力', value: game.player.attack },
            { label: '防御力', value: game.player.defense },
            { label: '移动速度', value: game.player.moveSpeed },
            { label: '暴击率', value: `${(game.player.critChance * 100).toFixed(0)}%` },
            { label: '暴击伤害', value: `${((game.player.critDamage - 1) * 100).toFixed(0)}%` },
            { label: '伤害加成', value: `${((game.player.damageMultiplier - 1) * 100).toFixed(0)}%` },
            { label: '体力恢复', value: `${game.player.staminaRegen.toFixed(1)}/回合` },
            { label: '生命恢复', value: `${game.player.hpRegenPerTurn}/回合` },
            { label: '移动消耗', value: `${game.player.getMoveCost()} 体力` },
            { label: '当前层数', value: game.currentFloor }
        ];
        
        let html = '';
        stats.forEach(stat => {
            html += `
                <div class="stat-detail-item">
                    <div class="stat-detail-label">${stat.label}</div>
                    <div class="stat-detail-value">${stat.value}</div>
                </div>
            `;
        });
        
        content.innerHTML = html;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}
