const express = require('express');
const { check } = require('express-validator');

const placeControllers = require('../controllers/places-controller')

const router = express.Router();

router.get('/:pid', placeControllers.getPlacesById);

router.get('/user/:uid', placeControllers.getPlacesByUserId);

router.post('/', check('title').not().isEmpty(), placeControllers.createPlace);

router.patch('/:pid', check('title').not().isEmpty(), placeControllers.updatePlace);

router.delete('/:pid', placeControllers.deletePlace);

module.exports = router;