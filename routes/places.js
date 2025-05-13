const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const { lat, lng, radius } = req.query;
    let types = req.query.type;
    let priceLevels = req.query.price_level;

    // Support single or multiple query params
    if (!Array.isArray(types) && types) types = [types];
    if (!Array.isArray(priceLevels) && priceLevels) priceLevels = [priceLevels];

    if (!lat || !lng || !radius) {
        return res.status(400).json({ error: 'Missing required query parameters (lat, lng, radius)' });
    }

    const baseParams = {
        location: `${lat},${lng}`,
        radius,
        key: process.env.GOOGLE_API_KEY,
        opennow: true
    };

    const results = [];

    try {
        // If no type is provided, just search once
        if (!types || types.length === 0) {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                params: baseParams
            });
            results.push(...response.data.results);
        } else {
            // Query Google Places for each type
            for (const type of types) {
                const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                    params: { ...baseParams, type }
                });

                const filtered = priceLevels
                    ? response.data.results.filter(place =>
                        priceLevels.includes(place.price_level?.toString())
                    )
                    : response.data.results;

                results.push(...filtered);
            }
        }

        // Deduplicate by place_id
        const unique = Array.from(new Map(results.map(p => [p.place_id, p])).values());

        // Optionally clean/structure the data
        const places = unique.map(p => ({
            placeId: p.place_id,
            name: p.name,
            address: p.vicinity,
            rating: p.rating ?? null,
            price_level: p.price_level ?? null,
            types: p.types ?? [],
            photo: p.photos && p.photos.length > 0
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${process.env.GOOGLE_API_KEY}`
                : null,
            latitude: p.geometry?.location?.lat ?? null,
            longitude: p.geometry?.location?.lng ?? null
        }));

        res.json(places);
    } catch (error) {
        console.error('Places API error:', error.message);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

module.exports = router;
