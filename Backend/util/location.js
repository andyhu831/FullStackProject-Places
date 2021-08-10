const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyBBB7bHFqNfYLfquBA3sNjwvZeXLFT-6Dg';

const getCoordsForAddress = async(address) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    const data = response.data;
    if (!data || data.status === 'ZERO_RESULTS') {
        return next(new HttpError('Could not find address', 422))
    }

    const coordinates = data.results[0].geometry.location;
    return coordinates;
}

module.exports = getCoordsForAddress;