class GameMap {
    constructor(size = 11) {
        this.size = size;
        this.grid = [];
        this.exitPosition = null;
    }
    
    init(playerX, playerY, currentFloor, unlockedGods) {
        this.grid = [];
        
        for (let y = 0; y < this.size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.size; x++) {
                this.grid[y][x] = {
                    x, y,
                    explored: false,
                    type: CellType.CHAOS,
                    contentType: null,
                    content: null
                };
            }
        }
        
        this.setCellExplored(playerX, playerY);
        this.exploreAdjacent(playerX, playerY);
        this.generateContent(currentFloor, unlockedGods);
        this.placeExit(playerX, playerY);
    }
    
    setCellExplored(x, y) {
        const cell = this.grid[y][x];
        cell.explored = true;
        cell.type = CellType.EXPLORED;
    }
    
    exploreAdjacent(x, y) {
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];
        
        directions.forEach(({ dx, dy }) => {
            const nx = x + dx;
            const ny = y + dy;
            if (this.isValidPosition(nx, ny) && !this.grid[ny][nx].explored) {
                this.grid[ny][nx].type = CellType.LOCKED;
            }
        });
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }
    
    canMoveTo(x, y, player) {
        if (!this.isValidPosition(x, y)) return false;
        const cell = this.grid[y][x];
        if (cell.explored) return true;
        if (cell.type === CellType.LOCKED) {
            return player.hasStamina();
        }
        return false;
    }
    
    getCell(x, y) {
        if (!this.isValidPosition(x, y)) return null;
        return this.grid[y][x];
    }
    
    generateContent(currentFloor, unlockedGods) {
        const contentTypes = [
            ContentType.MONSTER, 
            ContentType.TEMPLE, 
            ContentType.CHEST, 
            ContentType.SUPPLY, 
            ContentType.EMPTY
        ];
        const weights = [0.35, 0.1, 0.2, 0.15, 0.2];
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const cell = this.grid[y][x];
                if (cell.explored) continue;
                
                const rand = Math.random();
                let cumulative = 0;
                
                for (let i = 0; i < contentTypes.length; i++) {
                    cumulative += weights[i];
                    if (rand < cumulative) {
                        cell.contentType = contentTypes[i];
                        break;
                    }
                }
                
                this.generateCellContent(cell, currentFloor, unlockedGods);
            }
        }
    }
    
    generateCellContent(cell, currentFloor, unlockedGods) {
        switch (cell.contentType) {
            case ContentType.MONSTER:
                cell.content = this.generateMonster(currentFloor);
                if (!cell.content) {
                    cell.contentType = ContentType.EMPTY;
                }
                break;
                
            case ContentType.TEMPLE:
                cell.content = this.generateTemple(unlockedGods);
                if (!cell.content) {
                    cell.contentType = ContentType.SUPPLY;
                    cell.content = { type: 'full_restore' };
                }
                break;
                
            case ContentType.CHEST:
                cell.content = this.generateChestContent(currentFloor);
                break;
                
            case ContentType.SUPPLY:
                cell.content = {
                    type: Math.random() > 0.5 ? 'health' : 'stamina'
                };
                break;
        }
    }
    
    generateMonster(currentFloor) {
        const floorMultiplier = 1 + (currentFloor - 1) * 0.2;
        const availableMonsters = MONSTERS.filter(m => {
            const difficulty = (m.hp + m.attack * 3) / 10;
            return difficulty <= currentFloor + 2;
        });
        
        if (availableMonsters.length === 0) return null;
        
        const monster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
        return {
            ...monster,
            hp: Math.floor(monster.hp * floorMultiplier),
            maxHp: Math.floor(monster.hp * floorMultiplier),
            attack: Math.floor(monster.attack * floorMultiplier),
            defense: Math.floor(monster.defense * floorMultiplier)
        };
    }
    
    generateTemple(unlockedGods) {
        const availableGods = GODS.filter(g => !unlockedGods.has(g.id));
        if (availableGods.length === 0) return null;
        
        return availableGods[Math.floor(Math.random() * availableGods.length)];
    }
    
    generateChestContent(currentFloor) {
        const rand = Math.random();
        
        if (rand < 0.3) {
            const equipment = EQUIPMENT[Math.floor(Math.random() * EQUIPMENT.length)];
            return { type: 'equipment', item: { ...equipment } };
        } else if (rand < 0.6) {
            const incenseAmount = 10 + Math.floor(Math.random() * 20) + currentFloor * 5;
            return { type: 'incense', amount: incenseAmount };
        } else if (rand < 0.8) {
            const goldAmount = 20 + Math.floor(Math.random() * 30) + currentFloor * 10;
            return { type: 'gold', amount: goldAmount };
        } else {
            const potionType = Math.random() > 0.5 ? 'health_potion' : 'stamina_potion';
            const potion = ITEMS.find(i => i.id === potionType);
            return { type: 'potion', item: { ...potion }, quantity: 1 + Math.floor(Math.random() * 2) };
        }
    }
    
    placeExit(playerX, playerY) {
        const corners = [
            { x: 0, y: 0 },
            { x: this.size - 1, y: 0 },
            { x: 0, y: this.size - 1 },
            { x: this.size - 1, y: this.size - 1 }
        ];
        
        const farCorners = corners.filter(c => {
            const dist = Math.abs(c.x - playerX) + Math.abs(c.y - playerY);
            return dist >= this.size - 2;
        });
        
        const exitCorner = farCorners[Math.floor(Math.random() * farCorners.length)] || corners[0];
        
        this.exitPosition = exitCorner;
        this.grid[exitCorner.y][exitCorner.x].contentType = ContentType.EXIT;
        this.grid[exitCorner.y][exitCorner.x].content = { type: 'exit' };
    }
    
    isExit(x, y) {
        const cell = this.getCell(x, y);
        return cell && cell.contentType === ContentType.EXIT;
    }
    
    clearCellContent(x, y) {
        const cell = this.getCell(x, y);
        if (cell) {
            cell.contentType = ContentType.EMPTY;
            cell.content = null;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameMap };
}
