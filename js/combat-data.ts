
let curEncounter: any = null;
let enemyParty: any = null;
let currentActiveChar: any = null;

export function SetCurEncounter(enc: any) {
    curEncounter = enc;
}
export function SetEnemyParty(p: any) {
    enemyParty = p;
}
export function SetCurrentActiveChar(c: any) {
    currentActiveChar = c;
}

export function CurEncounter() {
    return curEncounter;
}
export function EnemyParty() {
    return enemyParty;
}
export function CurrentActiveChar() {
    return currentActiveChar;
}
