class Modal {
    static show() {
        document.getElementById('modal-overlay').classList.add('active');
    }
    
    static hide() {
        document.getElementById('modal-overlay').classList.remove('active');
    }
    
    static renderBattle(battle) {
        const content = document.getElementById('modal-content');
        
        const playerHpPercent = battle.getPlayerHpPercent();
        const monsterHpPercent = battle.getMonsterHpPercent();
        
        content.innerHTML = `
            <div class="battle-screen">
                <div class="modal-title">⚔️ 战斗</div>
                <div class="battle-combatants">
                    <div class="combatant">
                        <div class="combatant-icon">🧙</div>
                        <div class="combatant-name">你</div>
                        <div class="health-bar-container">
                            <div class="health-bar" style="width: ${playerHpPercent}%"></div>
                        </div>
                        <div class="health-text">${battle.player.hp}/${battle.player.maxHp}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">
                            攻击: ${battle.player.attack} | 防御: ${battle.player.defense}
                        </div>
                    </div>
                    <div style="font-size: 36px; align-self: center;">⚔️</div>
                    <div class="combatant">
                        <div class="combatant-icon">${battle.monster.icon}</div>
                        <div class="combatant-name">${battle.monster.name}</div>
                        <div class="health-bar-container">
                            <div class="health-bar" style="width: ${monsterHpPercent}%"></div>
                        </div>
                        <div class="health-text">${battle.monster.hp}/${battle.monster.maxHp}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">
                            攻击: ${battle.monster.attack} | 防御: ${battle.monster.defense}
                        </div>
                    </div>
                </div>
                <div class="battle-log" id="battle-log">
                    ${battle.log.length === 0 ? '<span style="color: #666;">战斗开始！</span>' : 
                      battle.log.map(l => `<div>${l}</div>`).join('')}
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-primary" onclick="game.battleAttack()">攻击</button>
                    <button class="btn btn-secondary" onclick="game.battleDefend()">防御</button>
                    <button class="btn btn-danger" onclick="game.battleFlee()">逃跑</button>
                </div>
            </div>
        `;
        
        this.show();
    }
    
    static renderBattleVictory(battle) {
        const reward = battle.getReward();
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-title">🎉 战斗胜利！</div>
            <div class="modal-content" style="text-align: center;">
                <p>你击败了 ${battle.monster.icon} ${battle.monster.name}！</p>
                <p style="margin-top: 15px;">
                    <span style="color: #feca57;">💰 ${reward.gold} 金币</span>
                    <span style="margin-left: 20px; color: #feca57;">🕯️ ${reward.incense} 香火</span>
                </p>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="game.closeModal()">继续探索</button>
            </div>
        `;
    }
    
    static renderBattleDefeat(game) {
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-title">💀 你倒下了...</div>
            <div class="modal-content" style="text-align: center;">
                <p>在第 ${game.currentFloor} 层倒下了</p>
                <p style="margin-top: 10px; color: #999;">
                    收集金币: ${game.player.gold}<br>
                    收集香火: ${game.player.incense}<br>
                    供奉神明: ${game.player.unlockedGods.length}/${GODS.length}
                </p>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="game.restart()">重新开始</button>
            </div>
        `;
    }
    
    static renderTemple(temple, game) {
        const god = temple.god;
        const isOffering = temple.canOffer(game.player, game.unlockedGods);
        const isAlreadyOffered = temple.isAlreadyOffered(game.unlockedGods);
        
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="temple-screen">
                <div class="modal-title">🛕 ${god.name} 的神庙</div>
                <div class="god-card ${isAlreadyOffered ? '' : 'offering'}">
                    <div class="god-icon">${god.icon}</div>
                    <div class="god-info">
                        <div class="god-name">${god.name}</div>
                        <div class="god-title">${god.title}</div>
                        <div class="god-blessing">✨ ${god.blessing}</div>
                        ${isAlreadyOffered ? 
                            '<div class="god-faith" style="color: #1dd1a1;">✓ 已获得祝福</div>' : 
                            `<div class="god-faith">🕯️ 供奉需要: ${god.offeringCost} 香火</div>`
                        }
                    </div>
                </div>
                <div class="temple-buttons">
                    ${isAlreadyOffered ? `
                        <button class="btn btn-secondary" onclick="game.closeModal()">离开</button>
                    ` : `
                        <button class="btn ${isOffering ? 'btn-primary' : 'btn btn-disabled'}" 
                                ${isOffering ? `onclick="game.offerToGod()"` : 'disabled'}>
                            供奉神明
                        </button>
                        <button class="btn btn-secondary" onclick="game.closeModal()">离开</button>
                    `}
                </div>
                ${!isAlreadyOffered ? `<div class="offering-cost">你当前有 ${game.player.incense} 香火</div>` : ''}
            </div>
        `;
        
        this.show();
    }
    
    static renderOfferSuccess(god) {
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-title">✨ 获得祝福！</div>
            <div class="modal-content" style="text-align: center;">
                <p>${god.icon} ${god.name} 接受了你的供奉！</p>
                <p style="margin-top: 15px; color: #48dbfb; font-weight: bold;">
                    ${god.blessing}
                </p>
                <p style="margin-top: 10px; color: #999; font-size: 12px;">
                    此效果将持续整个游戏
                </p>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="game.closeModal()">继续探索</button>
            </div>
        `;
    }
    
    static renderChest(message) {
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-title">📦 打开宝箱</div>
            <div class="modal-content" style="text-align: center; font-size: 18px;">
                ${message}
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="game.closeModal()">继续探索</button>
            </div>
        `;
        
        this.show();
    }
    
    static renderSupply(message) {
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-title">🏕️ 发现补给</div>
            <div class="modal-content" style="text-align: center; font-size: 18px; color: #1dd1a1;">
                ${message}
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="game.closeModal()">继续探索</button>
            </div>
        `;
        
        this.show();
    }
    
    static renderNextFloor(currentFloor) {
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-title">🚪 发现出口</div>
            <div class="modal-content" style="text-align: center;">
                <p>你找到了通往下一层的出口！</p>
                <p style="margin-top: 15px; color: #feca57;">
                    即将进入第 ${currentFloor + 1} 层
                </p>
                <p style="margin-top: 10px; color: #999; font-size: 12px;">
                    下一层的怪物会更加强大...
                </p>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="game.nextFloor()">进入下一层</button>
                <button class="btn btn-secondary" onclick="game.closeModal()">继续探索</button>
            </div>
        `;
        
        this.show();
    }
    
    static renderHelp() {
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-title">📖 游戏玩法说明</div>
            <div class="modal-content help-content">
                <h3>🎯 游戏目标</h3>
                <p>探索混沌地图，收集香火供奉神明，找到出口进入下一层。<br>
                供奉所有 10 位神明即可获得传说中的祝福！</p>
                
                <h3>🗺️ 探索机制</h3>
                <p>• <span class="highlight">❓ 未探索区域</span>: 消耗 <span class="highlight">10点体力</span> 解锁</p>
                <p>• <span class="highlight">🌿 已探索区域</span>: 移动不消耗体力</p>
                <p>• <span class="highlight">🚪 出口</span>: 找到后可进入下一层</p>
                <p>• 每移动一次，恢复少量体力和生命（若有祝福）</p>
                
                <h3>💀 战斗</h3>
                <p>遇到怪物时触发战斗，可选择：</p>
                <p>• <span class="highlight">攻击</span>: 造成伤害</p>
                <p>• <span class="highlight">防御</span>: 减少伤害并恢复少量生命</p>
                <p>• <span class="highlight">逃跑</span>: 基于移速的逃跑概率</p>
                
                <h3>🛕 神庙</h3>
                <p>• 消耗 <span class="highlight">香火</span> 供奉神明</p>
                <p>• 获得永久 <span class="highlight">祝福效果</span></p>
                <p>• 祝福持续整个游戏所有关卡</p>
                
                <h3>📦 宝箱 & 🏕️ 补给</h3>
                <p>• <span class="highlight">宝箱</span>: 装备、香火、金币、药水</p>
                <p>• <span class="highlight">补给</span>: 恢复生命或体力</p>
                
                <h3>⚔️ 装备</h3>
                <p>• 武器: 增加攻击力</p>
                <p>• 护甲: 增加防御力</p>
                <p>• 鞋子: 增加移速（提高逃跑率）</p>
                <p>• 饰品: 多种属性加成</p>
                
                <h3>⚠️ 失败条件</h3>
                <p>• 生命值降为 0 时游戏结束</p>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="game.closeModal()">明白了</button>
            </div>
        `;
        
        this.show();
    }
    
    static renderStart() {
        document.getElementById('start-screen').style.display = 'flex';
        document.getElementById('game-container').style.display = 'none';
    }
    
    static renderGame() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}
