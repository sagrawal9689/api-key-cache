const express = require('express');
const { fetchAvailableKey, createKey, getKeyInfo, deleteKey,unblockKey, keepKeyAlive }= require('../controllers/keyController')
const router = express.Router();


router.post('/keys', createKey);
router.get('/keys', fetchAvailableKey);
router.get('/keys/:id', getKeyInfo);
router.delete('/keys/:id', deleteKey);
router.put('/keys/:id', unblockKey);
router.put('/keepalive/:id', keepKeyAlive);



module.exports = router;