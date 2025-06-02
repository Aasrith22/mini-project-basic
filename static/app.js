// Global variables to store data
let techData = null;
let agricultureData = null;

// Company data mapping
const companyData = {
    computers: ['Apple', 'Dell', 'HP', 'Lenovo'],
    smartphones: ['Apple', 'Samsung', 'Google', 'OnePlus'],
    semiconductors: ['Intel', 'AMD', 'NVIDIA', 'TSMC'],
    software: ['Microsoft', 'Oracle', 'SAP', 'Salesforce']
};

// Region data mapping
const regionData = {
    wheat: ['North Plains', 'Central Belt', 'Southern Region', 'Coastal Area'],
    rice: ['Tropical Zone', 'Subtropical Belt', 'River Deltas', 'Monsoon Region'],
    corn: ['Midwest', 'Great Plains', 'Southeast', 'Northeast'],
    soybean: ['Upper Midwest', 'Lower Midwest', 'Delta Region', 'Eastern Belt']
};

// Weather metrics mapping
const weatherMetrics = {
    temperature: '°C',
    rainfall: 'mm',
    humidity: '%',
    sunshine: 'hours'
};

// API endpoints
const API_ENDPOINTS = {
    tech: {
        stockData: 'https://www.alphavantage.co/query',
    },
    weather: {
        data: 'https://api.openweathermap.org/data/2.5/weather'
    },
    regions: 'https://api.example.com/regions' // Add the API endpoint for regions
};

// Only show metrics available from Alpha Vantage free API
const availableFinancialMetrics = [
    { value: 'stock_price', label: 'Stock Price' },
    { value: 'trading_volume', label: 'Trading Volume' },
    { value: 'volatility', label: 'Volatility' }
];

function updateFinancialMetricDropdown() {
    const metricSelect = document.getElementById('financialMetric');
    if (!metricSelect) return;
    metricSelect.innerHTML = '';
    availableFinancialMetrics.forEach(metric => {
        const option = document.createElement('option');
        option.value = metric.value;
        option.textContent = metric.label;
        metricSelect.appendChild(option);
    });
}

// Function to fetch data from API with authentication
async function fetchFromAPI(endpoint, params = {}) {
    try {
        const url = new URL(endpoint);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

// Function to get weather data from OpenWeather
async function fetchWeatherData(lat, lon) {
    const params = {
        lat: lat,
        lon: lon,
        appid: window.config.OPENWEATHER_API_KEY,
        units: 'metric'
    };
    
    return await fetchFromAPI(API_ENDPOINTS.weather.data, params);
}

// Function to fetch historical weather data for the month
async function fetchMonthlyWeatherData(lat, lon, month, year) {
    const params = {
        lat: lat,
        lon: lon,
        appid: window.config.OPENWEATHER_API_KEY,
        units: 'metric',
        month: month,
        year: year
    };
    
    return await fetchFromAPI(API_ENDPOINTS.weather.data, params);
}

// Function to fetch tech data from backend
async function fetchTechData(category, company, metric) {
    try {
        const params = new URLSearchParams({
            category: category,
            company: company,
            metric: metric
        });
        const response = await fetch(`/api/tech/data?${params.toString()}`);
        
        // Try to parse JSON even if response is not OK
        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse JSON response from backend:', e);
            // If JSON parsing fails, log the raw response text
            try {
                const text = await response.text();
                console.error('Raw backend response text:', text);
            } catch (e) {
                console.error('Also failed to get raw response text:', e);
            }
        }

        if (!response.ok) {
            console.error(`API fetch error: HTTP status ${response.status}`, data); // Log status and response data
            // If there's an error object in the response, throw that as the error
            if (data && data.error) {
                throw new Error(`API fetch error: ${response.status} - ${data.error}`);
            }
             throw new Error(`API fetch error: HTTP status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API fetch error:', error); // This catches network errors or the errors thrown above
        return null;
    }
}

// Function to populate company dropdown based on selected category using backend
async function updateCompanyDropdown(category) {
    const companySelect = document.getElementById('techCompany');
    companySelect.innerHTML = '<option value="">Select Company</option>';
    companySelect.disabled = true;
    
    if (category) {
        try {
            const response = await fetch(`/api/tech/companies/${category}`);
            if (!response.ok) throw new Error('Failed to fetch companies');
            const companies = await response.json();
            // companies is an object: { SYMBOL: 'Company Name', ... }
            Object.entries(companies).forEach(([symbol, name]) => {
                // Only add if symbol is mapped in window.config.COMPANY_SYMBOLS (for frontend-backend consistency)
                if (Object.values(window.config.COMPANY_SYMBOLS).includes(symbol)) {
                    const option = document.createElement('option');
                    option.value = symbol;
                    option.textContent = name;
                    companySelect.appendChild(option);
                }
            });
            companySelect.disabled = false;
        } catch (err) {
            console.error('Error fetching companies:', err);
        }
    }
}

// Function to populate crop dropdown from backend
async function updateCropDropdown() {
    const cropSelect = document.getElementById('crop');
    cropSelect.innerHTML = '<option value="">Select Crop</option>';
    cropSelect.disabled = true;
    try {
        const response = await fetch('/api/agriculture/crops');
        if (!response.ok) throw new Error('Failed to fetch crops');
        const crops = await response.json(); // Array of crop names
        crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop;
            option.textContent = crop.charAt(0).toUpperCase() + crop.slice(1);
            cropSelect.appendChild(option);
        });
        cropSelect.disabled = false;
    } catch (err) {
        console.error('Error fetching crops:', err);
    }
}

// Function to populate region dropdown based on selected crop using backend
async function updateRegionDropdown(cropType) {
    const regionSelect = document.getElementById('region');
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    regionSelect.disabled = true;
    if (cropType) {
        try {
            const response = await fetch(`/api/agriculture/regions/${cropType}`);
            if (!response.ok) throw new Error('Failed to fetch regions for ' + cropType);
            const regions = await response.json(); // Array of region names
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
            regionSelect.disabled = false;
        } catch (err) {
            console.error('Error fetching regions:', err);
        }
    }
}

// Function to process monthly weather data
function processMonthlyWeatherData(data) {
    const monthlyData = {};
    data.forEach(entry => {
        const date = new Date(entry.date);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month}`;
        
        if (!monthlyData[key]) {
            monthlyData[key] = { temperature: 0, rainfall: 0, count: 0 };
        }
        monthlyData[key].temperature += entry.temperature;
        monthlyData[key].rainfall += entry.rainfall;
        monthlyData[key].count++;
    });
    
    // Calculate averages
    return Object.entries(monthlyData).map(([key, values]) => ({
        date: key,
        averageTemperature: values.temperature / values.count,
        totalRainfall: values.rainfall
    }));
}

// Function to update tech visualization with real data
async function updateTechVisualization() {
    console.log('Attempting to update tech visualization...'); // Log at the start
    const company = document.getElementById('techCompany').value;
    const metric = document.getElementById('financialMetric').value;
    const category = document.getElementById('techCategory').value;
    
    if (!company || !metric || !category) {
        console.log('Missing category, company, or metric.'); // Log if conditions not met
        return;
    }
    
    try {
        console.log(`Fetching tech data for category: ${category}, company: ${company}, metric: ${metric}`); // Log fetch details
        // Fetch from backend
        const techData = await fetchTechData(category, company, metric);

        console.log('Fetched tech data response:', techData); // Log the fetched data/error object

        // Check for null explicitly, as fetchTechData can now return null on network errors before parsing
        if (techData === null || (techData && techData.error)) {
             console.error('Backend returned error or null data:', techData);
             document.getElementById('techVisualization').innerHTML =
                 `<div class="alert alert-danger">Error fetching data. See console for details.${techData && techData.error ? ' ' + techData.error : ''}</div>`;
             return;
        }

        if (techData && Array.isArray(techData) && techData.length > 0) {
            createVisualization(
                techData,
                'techVisualization',
                `${company} ${metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
                metric,
                metric === 'stock_price' ? 'Price (USD)' :
                metric === 'market_cap' ? 'Market Cap (USD)' :
                metric === 'trading_volume' ? 'Volume' :
                metric === 'volatility' ? 'Volatility' : 'Value'
            );
        } else {
            document.getElementById('techVisualization').innerHTML = 
                '<div class="alert alert-warning">No data available for visualization</div>';
        }
    } catch (error) {
        console.error('Error updating tech visualization:', error);
        // Fallback to sample data
        const sampleData = generateTechData(category, company, metric);
        createVisualization(
            sampleData,
            'techVisualization',
            `${company} Data (Sample)`,
            metric,
            'Value'
        );
    }
}

// Function to update agriculture visualization with real weather data
async function updateAgricultureVisualization() {
    const region = document.getElementById('region').value;
    const metric = document.getElementById('weatherMetric').value;
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Months are 0-based
    const year = currentDate.getFullYear();
    
    if (!region || !metric) return;
    
    try {
        const coords = window.config.REGION_COORDINATES[region];
        const weatherData = await fetchMonthlyWeatherData(coords.lat, coords.lon, month, year);
        const processedData = processMonthlyWeatherData(weatherData);
        
        if (processedData) {
            createVisualization(
                processedData,
                'agricultureVisualization',
                `${region} Monthly Weather Data`,
                metric,
                weatherMetrics[metric]
            );
        } else {
            document.getElementById('agricultureVisualization').innerHTML = 
                '<div class="alert alert-warning">No data available for visualization</div>';
        }
    } catch (error) {
        console.error('Error updating agriculture visualization:', error);
        // Fallback to sample data
        const sampleData = generateAgricultureData(crop, region, metric);
        createVisualization(
            sampleData,
            'agricultureVisualization',
            `${region} Data (Sample)`,
            metric,
            weatherMetrics[metric]
        );
    }
}

// Function to validate tech selections
function validateTechSelections() {
    const category = document.getElementById('techCategory').value;
    const company = document.getElementById('techCompany').value;
    const metric = document.getElementById('financialMetric').value;
    const analyzeBtn = document.getElementById('analyzeTech');

    analyzeBtn.disabled = !(category && company && metric);
}

// Function to validate agriculture selections
function validateAgricultureSelections() {
    const crop = document.getElementById('crop').value;
    const region = document.getElementById('region').value;
    const metric = document.getElementById('weatherMetric').value;
    const analyzeBtn = document.getElementById('analyzeAgriculture');

    analyzeBtn.disabled = !(crop && region && metric);
}

// Function to create a visualization
function createVisualization(data, containerId, title, selectedMetric, yAxisLabel) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<div class="alert alert-warning">No data available for visualization</div>';
        return;
    }

    const traces = [{
        x: data.map(item => item.date),
        y: data.map(item => item[selectedMetric]),
        name: data[0].name,
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            width: 2,
            color: '#4a90e2'
        },
        marker: {
            size: 6,
            color: '#4a90e2'
        }
    }];

    const layout = {
        title: {
            text: title,
            font: { size: 24 }
        },
        xaxis: { 
            title: 'Date',
            tickangle: -45,
            gridcolor: '#E1E1E1',
            showgrid: true
        },
        yaxis: { 
            title: yAxisLabel,
            gridcolor: '#E1E1E1',
            showgrid: true
        },
        showlegend: true,
        legend: { 
            orientation: 'h', 
            y: -0.2 
        },
        plot_bgcolor: '#FFFFFF',
        paper_bgcolor: '#FFFFFF',
        hovermode: 'closest',
        margin: { t: 50, b: 100, l: 60, r: 40 }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot(containerId, traces, layout, config);
}

// Function to generate sample tech data
function generateTechData(category, company, metric) {
    const data = [];
    const today = new Date();
    const numDays = 30;
    let baseValue = Math.random() * 100 + 50;
    
    for (let i = 0; i < numDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (numDays - i));
        
        const randomChange = (Math.random() - 0.5) * 5;
        baseValue += randomChange;
        
        const dataPoint = {
            date: date.toISOString().split('T')[0],
            name: company,
            category: category
        };

        switch(metric) {
            case 'stock_price':
                dataPoint[metric] = baseValue;
                break;
            case 'market_cap':
                dataPoint[metric] = baseValue * 1000000;
                break;
            case 'trading_volume':
                dataPoint[metric] = Math.round(baseValue * 10000);
                break;
            case 'volatility':
                dataPoint[metric] = Math.abs(randomChange);
                break;
        }
        
        data.push(dataPoint);
    }
    
    return data;
}

// Function to generate sample agriculture data
function generateAgricultureData(crop, region, metric) {
    const data = [];
    const today = new Date();
    const numDays = 30;
    let baseValue;
    
    // Set appropriate base values for different metrics
    switch(metric) {
        case 'temperature':
            baseValue = 25; // Average temperature in Celsius
            break;
        case 'rainfall':
            baseValue = 50; // Average rainfall in mm
            break;
        case 'humidity':
            baseValue = 65; // Average humidity percentage
            break;
        case 'sunshine':
            baseValue = 8; // Average sunshine hours
            break;
    }
    
    for (let i = 0; i < numDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (numDays - i));
        
        // Add seasonal variation
        const seasonalFactor = Math.sin((i / numDays) * Math.PI * 2);
        const randomVariation = (Math.random() - 0.5) * 2;
        let value = baseValue + (seasonalFactor * 5) + randomVariation;
        
        // Ensure values stay within realistic ranges
        switch(metric) {
            case 'temperature':
                value = Math.max(10, Math.min(40, value));
                break;
            case 'rainfall':
                value = Math.max(0, value);
                break;
            case 'humidity':
                value = Math.max(30, Math.min(100, value));
                break;
            case 'sunshine':
                value = Math.max(0, Math.min(12, value));
                break;
        }
        
        data.push({
            date: date.toISOString().split('T')[0],
            name: `${crop} in ${region}`,
            crop: crop,
            region: region,
            [metric]: value
        });
    }
    
    return data;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    updateFinancialMetricDropdown();
    // Tech & Finance event listeners
    const techCategory = document.getElementById('techCategory');
    const techCompany = document.getElementById('techCompany');
    const financialMetric = document.getElementById('financialMetric');
    const analyzeTechBtn = document.getElementById('analyzeTech');
    
    if (techCategory) {
        techCategory.addEventListener('change', async function() {
            await updateCompanyDropdown(this.value);
            validateTechSelections();
        });
    }
    
    if (techCompany) {
        techCompany.addEventListener('change', validateTechSelections);
    }
    
    if (financialMetric) {
        financialMetric.addEventListener('change', validateTechSelections);
    }
    
    if (analyzeTechBtn) {
        analyzeTechBtn.addEventListener('click', updateTechVisualization);
    }
    
    // Agriculture & Weather event listeners
    const cropSelect = document.getElementById('crop');
    const regionSelect = document.getElementById('region');
    const weatherMetric = document.getElementById('weatherMetric');
    const analyzeAgricultureBtn = document.getElementById('analyzeAgriculture');
    
    if (cropSelect) {
        cropSelect.addEventListener('change', async function() {
            await updateRegionDropdown(this.value);
            validateAgricultureSelections();
        });
        // Populate crops from backend on load
        updateCropDropdown();
    }
    
    if (regionSelect) {
        regionSelect.addEventListener('change', validateAgricultureSelections);
    }
    
    if (weatherMetric) {
        weatherMetric.addEventListener('change', validateAgricultureSelections);
    }
    
    if (analyzeAgricultureBtn) {
        analyzeAgricultureBtn.addEventListener('click', updateAgricultureVisualization);
    }
});

// Test function to check API connectivity
async function testAPIs() {
    console.log('Testing API connectivity...');
    
    // Test backend /api/tech/data endpoint
    try {
        console.log('Testing backend /api/tech/data endpoint...');
        const testCategory = 'smartphones';
        const testCompany = '005930.KS'; // Samsung symbol
        const testMetric = 'stock_price';
        const params = new URLSearchParams({
            category: testCategory,
            company: testCompany,
            metric: testMetric
        });
        const response = await fetch(`/api/tech/data?${params.toString()}`);
        const techData = await response.json();
        if (Array.isArray(techData) && techData.length > 0) {
            console.log('✅ Backend /api/tech/data is working!');
            console.log('Sample data:', techData.slice(0, 3));
        } else {
            console.error('❌ Backend /api/tech/data returned no data. Check your backend and API keys.');
            console.log('Response:', techData);
        }
    } catch (error) {
        console.error('❌ Backend /api/tech/data error:', error);
    }

    // Test OpenWeather API
    try {
        console.log('Testing OpenWeather API...');
        const testCoords = { lat: 40.7128, lon: -74.0060 }; // New York coordinates
        const weatherData = await fetchWeatherData(testCoords.lat, testCoords.lon);
        if (weatherData && weatherData.main) {
            console.log('✅ OpenWeather API is working!');
            console.log('Sample data:', {
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity
            });
        } else {
            console.error('❌ OpenWeather API returned no data. Check your API key.');
            console.log('Response:', weatherData);
        }
    } catch (error) {
        console.error('❌ OpenWeather API error:', error);
    }
}

// Add test function to window object so it can be called from console
window.testAPIs = testAPIs;
