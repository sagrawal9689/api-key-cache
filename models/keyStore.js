const { v4: generateUuid } = require('uuid');

let keys = {};
const keyTTL = 2 * 60 * 1000;
const unblockTimeout = 60 * 1000; 


function generateKey() {
    const keyId = generateUuid();
    const createdAt = Date.now();
    const expiresAt = createdAt + keyTTL;

    function scheduleKeyExpiration(keyId, expiresAt) {
        keys[keyId].expirationTimer = setTimeout(() => {
            if (keys[keyId] && keys[keyId].expiresAt <= Date.now()) {
                delete keys[keyId];
            }
        }, expiresAt - Date.now());
    }

    keys[keyId] = { keyId, createdAt, expiresAt, isBlocked: false, blockedAt: null, expirationTimer: null, unblockTimer: null };

    scheduleKeyExpiration(keyId, expiresAt);

    return keyId;
}


function getAvailableKey() {
    const now = Date.now();
    const availableKeys = Object.values(keys).filter(key => key.expiresAt > now && !key.isBlocked);

    if (availableKeys.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableKeys.length);
    const selectedKey = availableKeys[randomIndex];

    selectedKey.isBlocked = true;
    selectedKey.blockedAt = now;

    clearTimeout(keys[selectedKey.keyId].unblockTimer);
    selectedKey.unblockTimer = setTimeout(() => {
        if (keys[selectedKey.keyId] && keys[selectedKey.keyId].isBlocked) {
            keys[selectedKey.keyId].isBlocked = false;
            keys[selectedKey.keyId].blockedAt = null;
        }
    }, unblockTimeout);

    return selectedKey.keyId;
}

function getKeyDetails(keyId) {
    const key = keys[keyId];
    if (key && key.expiresAt > Date.now()) {
        return key;
    } else {
        delete keys[keyId];
        return null;
    }
}

function removeKey(keyId) {
    if (keys[keyId]) {
        clearTimeout(keys[keyId].expirationTimer);
        clearTimeout(keys[keyId].unblockTimer);
        delete keys[keyId];
        return true;
    }
    return false;
}

function unblockKeyById(keyId) {
    const key = keys[keyId];
    if (key && key.isBlocked) {
        key.isBlocked = false;
        key.blockedAt = null;
        clearTimeout(key.unblockTimer);
        return true;
    }
    return false;
}

function keepAliveKey(keyId) {
    const key = keys[keyId];
    if (key && key.expiresAt > Date.now()) {
        key.expiresAt = Date.now() + keyTTL;

        clearTimeout(key.expirationTimer);
        key.expirationTimer = setTimeout(() => {
            if (keys[keyId] && keys[keyId].expiresAt <= Date.now()) {
                delete keys[keyId];
            }
        }, keyTTL);

        return true;
    } else if (key) {
        delete keys[keyId];
    }
    return false;
}


module.exports={ generateKey , getAvailableKey ,getKeyDetails , removeKey, unblockKeyById, keepAliveKey}