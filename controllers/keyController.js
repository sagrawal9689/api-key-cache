const { generateKey,getAvailableKey,getKeyDetails,removeKey , unblockKeyById, keepAliveKey }= require('../models/keyStore')

const createKey = (req, res) => {
    const keyId = generateKey();
    res.status(201).json({ keyId });
};

const fetchAvailableKey=(req,res)=>{
    const keyId = getAvailableKey();
    if (keyId) {
        res.status(200).json({ keyId });
    } else {
        res.sendStatus(404);
    }
}

function deleteKey(req, res) {
    const keyId = req.params.id;
    const removed = removeKey(keyId);
    if (removed) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

function getKeyInfo(req, res) {
    const keyId = req.params.id;
    const keyDetails = getKeyDetails(keyId);
    if (keyDetails) {
        res.status(200).json({
            isBlocked: keyDetails.isBlocked,
            blockedAt: keyDetails.blockedAt,
            createdAt: keyDetails.createdAt
        });
    } else {
        res.sendStatus(404);
    }
}

function unblockKey(req, res) {
    const keyId = req.params.id;
    const unblocked = unblockKeyById(keyId);
    if (unblocked) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

function keepKeyAlive(req, res) {
    const keyId = req.params.id;
    const keptAlive = keepAliveKey(keyId);
    if (keptAlive) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}



module.exports= { fetchAvailableKey,createKey, getKeyInfo,deleteKey,unblockKey ,keepKeyAlive }