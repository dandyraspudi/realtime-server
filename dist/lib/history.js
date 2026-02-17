"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchHistory = void 0;
exports.saveMatch = saveMatch;
exports.matchHistory = [];
function saveMatch(data) {
    exports.matchHistory.push(data);
}
