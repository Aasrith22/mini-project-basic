// OpenWeather API configuration
window.config = {
    OPENWEATHER_API_KEY: '3b0b813ec61c47616d9f4b564d3155a2', // Replace with your actual API key
    // Mapping of regions to their coordinates for weather data
    REGION_COORDINATES: {
        'North America': { lat: 40.7128, lon: -74.0060 }, // New York coordinates as reference
        'South America': { lat: -23.5505, lon: -46.6333 }, // São Paulo coordinates
        'Europe': { lat: 51.5074, lon: -0.1278 }, // London coordinates
        'Asia': { lat: 31.2304, lon: 121.4737 }, // Shanghai coordinates
        'Africa': { lat: -26.2041, lon: 28.0473 }, // Johannesburg coordinates
        'Australia': { lat: -33.8688, lon: 151.2093 }, // Sydney coordinates
        'South Asia': { lat: 28.6139, lon: 77.2090 }, // Delhi coordinates
        'East Asia': { lat: 35.6762, lon: 139.6503 }, // Tokyo coordinates
        'Southeast Asia': { lat: 1.3521, lon: 103.8198 }, // Singapore coordinates
    }
};

// Export the config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
