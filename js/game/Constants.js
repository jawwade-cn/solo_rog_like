const GameState = {
    START: 'start',
    PLAYING: 'playing',
    BATTLE: 'battle',
    TEMPLE: 'temple',
    DEFEAT: 'defeat'
};

const CellType = {
    CHAOS: 'chaos',
    LOCKED: 'locked',
    EXPLORED: 'explored'
};

const ContentType = {
    EMPTY: 'empty',
    MONSTER: 'monster',
    TEMPLE: 'temple',
    CHEST: 'chest',
    SUPPLY: 'supply',
    EXIT: 'exit'
};

const BattleResult = {
    ONGOING: 'ongoing',
    PLAYER_WIN: 'player_win',
    PLAYER_LOSE: 'player_lose',
    FLEE: 'flee'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameState, CellType, ContentType, BattleResult };
}
