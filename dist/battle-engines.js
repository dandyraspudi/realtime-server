"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attack = attack;
function attack(room, attackerId) {
    if (room.winner)
        return room;
    const attacker = room.players.find((p) => p.id === attackerId);
    const defender = room.players.find((p) => p.id !== attackerId);
    if (!attacker || !defender)
        return room;
    const damage = Math.floor(Math.random() * 15) + 5;
    defender.hp = Math.max(0, defender.hp - damage);
    room.battleLog.push(`${attacker.name} hits ${defender.name} for ${damage}`);
    if (defender.hp === 0) {
        room.winner = attacker.id;
        room.battleLog.push(`${attacker.name} wins!`);
    }
    else {
        room.turn = defender.id;
    }
    return room;
}
