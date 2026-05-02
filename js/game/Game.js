class Game {
    constructor() {
        this.init();
    }
    
    init() {
        this.player = new Player();
        this.map = new GameMap(11);
        this.currentFloor = 1;
        this.state = GameState.START;
        this.currentBattle = null;
        this.currentTemple = null;
        this.unlockedGods = new Set();
        this.logs = [];
    }
    
    startGame() {
        Modal.renderGame();
        this.initMap();
        this.state = GameState.PLAYING;
        Renderer.renderAll(this);
        this.addLog('你从混沌中醒来，四周杂草丛生...', 'explore');
    }
    
    initMap() {
        const startX = Math.floor(this.map.size / 2);
        const startY = Math.floor(this.map.size / 2);
        
        this.player.x = startX;
        this.player.y = startY;
        
        this.map.init(startX, startY, this.currentFloor, this.unlockedGods);
    }
    
    moveTo(x, y) {
        if (this.state !== GameState.PLAYING) return;
        if (!this.map.canMoveTo(x, y, this.player)) return;
        if (x === this.player.x && y === this.player.y) return;
        
        const cell = this.map.getCell(x, y);
        
        if (!cell.explored) {
            if (!this.player.consumeStamina()) {
                this.addLog('体力不足，无法探索！', 'explore');
                return;
            }
            
            this.map.setCellExplored(x, y);
            this.map.exploreAdjacent(x, y);
            this.addLog(`探索了新区域 (${x}, ${y})，消耗 ${this.player.getMoveCost()} 体力`, 'explore');
        }
        
        this.player.x = x;
        this.player.y = y;
        
        this.player.regenerateHp();
        this.player.regenerateStamina();
        
        if (this.map.isExit(x, y)) {
            this.showNextFloor();
            return;
        }
        
        this.handleCellContent(cell);
        Renderer.renderAll(this);
    }
    
    handleCellContent(cell) {
        if (!cell.contentType || cell.contentType === 'empty') {
            if (Math.random() < 0.3) {
                const smallGold = Loot.findSmallGold();
                this.player.gold += smallGold;
                this.addLog(`在杂草中发现了 ${smallGold} 金币！`, 'loot');
            }
            return;
        }
        
        switch (cell.contentType) {
            case 'monster':
                this.startBattle(cell);
                break;
            case 'temple':
                this.enterTemple(cell);
                break;
            case 'chest':
                this.openChest(cell);
                break;
            case 'supply':
                this.useSupply(cell);
                break;
        }
    }
    
    startBattle(cell) {
        const monster = cell.content;
        this.currentBattle = new Battle(this.player, monster);
        this.state = GameState.BATTLE;
        Modal.renderBattle(this.currentBattle);
        this.addLog(`遭遇了 ${monster.icon} ${monster.name}！`, 'battle');
    }
    
    battleAttack() {
        if (!this.currentBattle) return;
        
        const result = this.currentBattle.playerAttack();
        Modal.renderBattle(this.currentBattle);
        
        if (result === BattleResult.PLAYER_WIN) {
            this.battleVictory();
        } else if (result === BattleResult.PLAYER_LOSE) {
            this.battleDefeat();
        }
    }
    
    battleDefend() {
        if (!this.currentBattle) return;
        
        const result = this.currentBattle.playerDefend();
        Modal.renderBattle(this.currentBattle);
        
        if (result === BattleResult.PLAYER_LOSE) {
            this.battleDefeat();
        }
    }
    
    battleFlee() {
        if (!this.currentBattle) return;
        
        const success = this.currentBattle.tryFlee();
        Modal.renderBattle(this.currentBattle);
        
        if (success) {
            this.addLog('成功逃离战斗', 'battle');
            this.state = GameState.PLAYING;
            this.currentBattle = null;
            Modal.hide();
            Renderer.renderAll(this);
        } else if (this.currentBattle.result === BattleResult.PLAYER_LOSE) {
            this.battleDefeat();
        }
    }
    
    battleVictory() {
        const reward = this.currentBattle.getReward();
        
        this.player.gold += reward.gold;
        this.player.incense += reward.incense;
        
        this.addLog(
            `击败了 ${this.currentBattle.monster.icon} ${this.currentBattle.monster.name}！获得 ${reward.gold} 金币和 ${reward.incense} 香火`, 
            'battle'
        );
        
        this.map.clearCellContent(this.player.x, this.player.y);
        
        Modal.renderBattleVictory(this.currentBattle);
        this.state = GameState.PLAYING;
        this.currentBattle = null;
        Renderer.renderAll(this);
    }
    
    battleDefeat() {
        this.state = GameState.DEFEAT;
        Modal.renderBattleDefeat(this);
    }
    
    enterTemple(cell) {
        const god = cell.content;
        this.currentTemple = new Temple(god);
        this.state = GameState.TEMPLE;
        Modal.renderTemple(this.currentTemple, this);
        this.addLog(`发现了供奉 ${god.icon} ${god.name} 的神庙`, 'temple');
    }
    
    offerToGod() {
        if (!this.currentTemple) return;
        
        const result = this.currentTemple.offer(this.player, this.unlockedGods);
        
        if (result.success) {
            this.map.clearCellContent(this.player.x, this.player.y);
            this.addLog(
                `向 ${result.god.icon} ${result.god.name} 供奉香火，获得祝福: ${result.god.blessing}`, 
                'temple'
            );
            Modal.renderOfferSuccess(result.god);
        }
        
        this.state = GameState.PLAYING;
        this.currentTemple = null;
        Renderer.renderAll(this);
    }
    
    openChest(cell) {
        const lootMessage = Loot.handleChest(cell.content, this.player);
        this.addLog(`打开宝箱：${lootMessage}`, 'loot');
        this.map.clearCellContent(this.player.x, this.player.y);
        Modal.renderChest(lootMessage);
        Renderer.renderAll(this);
    }
    
    useSupply(cell) {
        const message = Loot.handleSupply(cell.content, this.player);
        this.addLog(`发现补给：${message}`, 'loot');
        this.map.clearCellContent(this.player.x, this.player.y);
        Modal.renderSupply(message);
        Renderer.renderAll(this);
    }
    
    showNextFloor() {
        Modal.renderNextFloor(this.currentFloor);
    }
    
    nextFloor() {
        this.currentFloor++;
        this.initMap();
        this.addLog(`进入第 ${this.currentFloor} 层...`, 'explore');
        Modal.hide();
        this.state = GameState.PLAYING;
        Renderer.renderAll(this);
    }
    
    closeModal() {
        Modal.hide();
        this.state = GameState.PLAYING;
    }
    
    useItem(inventoryIndex) {
        if (this.player.useItem(inventoryIndex)) {
            Renderer.renderAll(this);
        }
    }
    
    equipItem(inventoryIndex) {
        const item = this.player.inventory[inventoryIndex];
        if (!item || !item.slot) return;
        
        const oldEquip = this.player.equipItem(item, inventoryIndex);
        this.addLog(`装备了 ${item.icon} ${item.name}`, 'loot');
        Renderer.renderAll(this);
    }
    
    unequipItem(slot) {
        const item = this.player.unequipItem(slot);
        if (item) {
            this.addLog(`卸下了 ${item.icon} ${item.name}`, 'loot');
            Renderer.renderAll(this);
        }
    }
    
    showHelp() {
        Modal.renderHelp();
    }
    
    switchTab(tabName) {
        const tabs = ['inventory', 'equipment', 'gods', 'stats'];
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach((tab, index) => {
            if (tab === tabName) {
                tabBtns[index].classList.add('active');
                tabContents[index].classList.add('active');
            } else {
                tabBtns[index].classList.remove('active');
                tabContents[index].classList.remove('active');
            }
        });
    }
    
    addLog(message, type = 'explore') {
        this.logs.unshift({ message, type, time: Date.now() });
        if (this.logs.length > 50) {
            this.logs.pop();
        }
    }
    
    restart() {
        this.init();
        Modal.renderStart();
        Modal.hide();
    }
}

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Game };
}
