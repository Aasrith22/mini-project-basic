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
    wheat: ['North America', 'Europe', 'Asia', 'Australia'],
    rice: ['South Asia', 'East Asia', 'Southeast Asia', 'South America'],
    corn: ['North America', 'South America', 'Europe', 'Africa'],
    soybeans: ['North America', 'South America', 'Asia', 'Africa']
};

// Function to populate company dropdown based on selected category
function updateCompanyDropdown(category) {
    const companySelect = document.getElementById('techCompany');
    if (!companySelect) {
        console.error('Company select element not found');
        return;
    }
    
    companySelect.innerHTML = '<option value="">Select Company</option>';
    
    if (category && companyData[category]) {
        companyData[category].forEach(company => {
            const option = document.createElement('option');
            option.value = company;
            option.textContent = company;
            companySelect.appendChild(option);
        });
        companySelect.disabled = false;
    } else {
        companySelect.disabled = true;
    }
}

// Function to populate region dropdown based on selected crop
function updateRegionDropdown(cropType) {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) {
        console.error('Region select element not found');
        return;
    }
    
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    
    if (cropType && regionData[cropType]) {
        regionData[cropType].forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
        regionSelect.disabled = false;
    } else {
        regionSelect.disabled = true;
    }
}

// Function to validate tech selections
function validateTechSelections() {
    const category = document.getElementById('techCategory').value;
    const company = document.getElementById('techCompany').value;
    const metric = document.getElementById('financialMetric').value;
    const analyzeBtn = document.getElementById('analyzeTech');

    if (category && company && metric) {
        analyzeBtn.disabled = false;
    } else {
        analyzeBtn.disabled = true;
    }
}

// Function to validate agriculture selections
function validateAgricultureSelections() {
    const cropType = document.getElementById('cropType').value;
    const region = document.getElementById('region').value;
    const metric = document.getElementById('weatherMetric').value;
    const analyzeBtn = document.getElementById('analyzeAgriculture');

    if (cropType && region && metric) {
        analyzeBtn.disabled = false;
    } else {
        analyzeBtn.disabled = true;
    }
}

// Function to create a visualization
function createVisualization(data, containerId, title, selectedMetric) {
    // Check if Plotly is loaded
    if (typeof Plotly === 'undefined') {
        console.error('Plotly library is not loaded!');
        return;
    }

    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found!`);
        return;
    }

    if (!data || data.length === 0) {
        console.error(`No data available for ${containerId}`);
        container.innerHTML = '<div class="alert alert-warning">No data available for visualization</div>';
        return;
    }

    let traces = [];
    
    try {
        if (Array.isArray(data)) {
            // For single company selection
            traces.push({
                x: data.map(item => item.date),
                y: data.map(item => item[selectedMetric]),
                name: data[0].company || data[0].region,
                type: 'scatter',
                mode: 'lines+markers',
                line: {
                    width: 2
                },
                marker: {
                    size: 6
                }
            });
        }

        const layout = {
            title: {
                text: title,
                font: {
                    size: 24
                }
            },
            xaxis: { 
                title: 'Date',
                tickangle: -45,
                gridcolor: '#E1E1E1',
                showgrid: true
            },
            yaxis: { 
                title: selectedMetric.replace(/_/g, ' ').toUpperCase(),
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

        Plotly.newPlot(containerId, traces, layout, config)
            .then(() => console.log(`Successfully created visualization for ${containerId}`))
            .catch(error => console.error('Error creating plot:', error));

    } catch (error) {
        console.error('Error in createVisualization:', error);
        container.innerHTML = '<div class="alert alert-danger">Error creating visualization</div>';
    }
}

// Function to generate sample data for demonstration
function generateSampleData(category, company, metric) {
    const data = [];
    const today = new Date();
    const numDays = 30;
    let baseValue = Math.random() * 100 + 50; // Random base value between 50 and 150
    
    for (let i = 0; i < numDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (numDays - i));
        
        // Add some random variation to the base value
        const randomChange = (Math.random() - 0.5) * 5;
        baseValue += randomChange;
        
        data.push({
            date: date.toISOString().split('T')[0],
            company: company,
            category: category,
            stock_price: baseValue,
            market_cap: baseValue * 1000000,
            trading_volume: Math.floor(Math.random() * 1000000),
            volatility: Math.random() * 2
        });
    }

    return data;
}

// Function to generate sample agriculture data
function generateAgricultureData(cropType, region, metric) {
    const data = [];
    const today = new Date();
    const numDays = 30;
    let baseValue = Math.random() * 30 + 10; // Random base value between 10 and 40
    
    for (let i = 0; i < numDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (numDays - i));
        
        // Add some random variation to the base value
        const randomChange = (Math.random() - 0.5) * 3;
        baseValue += randomChange;
        
        data.push({
            date: date.toISOString().split('T')[0],
            region: region,
            crop_type: cropType,
            temperature: baseValue,
            rainfall: Math.random() * 100,
            humidity: Math.random() * 100,
            soil_moisture: Math.random() * 100
        });
    }

    return data;
}

// Function to fetch weather data from OpenWeather API
async function fetchWeatherData(region, metric) {
    try {
        // Check if config is available
        if (typeof window.config === 'undefined') {
            console.error('Config object not found. Make sure config.js is loaded before app.js');
            throw new Error('Configuration not loaded');
        }

        if (!window.config.OPENWEATHER_API_KEY || window.config.OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
            console.error('Please set your OpenWeather API key in config.js');
            throw new Error('OpenWeather API key not configured');
        }

        const coordinates = window.config.REGION_COORDINATES[region];
        if (!coordinates) {
            console.error('Region coordinates not found:', region);
            throw new Error('Region coordinates not found');
        }

        // Fetch 5 day / 3 hour forecast data
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${window.config.OPENWEATHER_API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }

        const data = await response.json();
        return data.list.map(item => ({
            date: item.dt_txt.split(' ')[0],
            region: region,
            temperature: item.main.temp,
            humidity: item.main.humidity,
            rainfall: item.rain ? item.rain['3h'] || 0 : 0,
            soil_moisture: null // OpenWeather free API doesn't provide soil moisture data
        }));
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Function to fetch financial data from Alpha Vantage API
async function fetchFinancialData(company, metric) {
    try {
        if (typeof window.config === 'undefined') {
            console.error('Config object not found. Make sure config.js is loaded before app.js');
            throw new Error('Configuration not loaded');
        }

        if (!window.config.ALPHA_VANTAGE_API_KEY || window.config.ALPHA_VANTAGE_API_KEY === 'YOUR_ALPHA_VANTAGE_API_KEY') {
            console.error('Please set your Alpha Vantage API key in config.js');
            throw new Error('Alpha Vantage API key not configured');
        }

        const symbol = window.config.COMPANY_SYMBOLS[company];
        if (!symbol) {
            console.error('Company symbol not found:', company);
            throw new Error('Company symbol not found');
        }

        // Determine which API function to use based on the metric
        let function_name = 'TIME_SERIES_DAILY';
        if (metric === 'trading_volume') {
            function_name = 'TIME_SERIES_DAILY'; // Volume is included in daily data
        } else if (metric === 'market_cap') {
            function_name = 'OVERVIEW'; // Market cap is in the company overview
        }

        const response = await fetch(`https://www.alphavantage.co/query?function=${function_name}&symbol=${symbol}&apikey=${window.config.ALPHA_VANTAGE_API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Financial API request failed');
        }

        const data = await response.json();
        
        // Process the data based on the metric
        if (metric === 'market_cap') {
            return [{
                date: new Date().toISOString().split('T')[0],
                company: company,
                market_cap: parseFloat(data.MarketCapitalization),
                stock_price: null,
                trading_volume: null,
                volatility: null
            }];
        } else {
            const timeSeriesData = data['Time Series (Daily)'];
            if (!timeSeriesData) {
                throw new Error('No time series data available');
            }

            // Convert the data to our format
            return Object.entries(timeSeriesData).slice(0, 30).map(([date, values]) => ({
                date: date,
                company: company,
                stock_price: parseFloat(values['4. close']),
                trading_volume: parseFloat(values['5. volume']),
                market_cap: null,
                volatility: calculateVolatility(values)
            }));
        }
    } catch (error) {
        console.error('Error fetching financial data:', error);
        throw error;
    }
}

// Helper function to calculate volatility
function calculateVolatility(dayData) {
    const high = parseFloat(dayData['2. high']);
    const low = parseFloat(dayData['3. low']);
    return ((high - low) / low) * 100; // Simple volatility as percentage of price range
}

// Function to update tech visualization
function updateTechVisualization() {
    const category = document.getElementById('techCategory').value;
    const company = document.getElementById('techCompany').value;
    const metric = document.getElementById('financialMetric').value;
    const container = document.getElementById('techVisualization');
    const analyzeButton = document.getElementById('analyzeTech');

    if (!container) {
        console.error('Tech visualization container not found!');
        return;
    }

    if (!category || !company || !metric) {
        console.log('Please select category, company, and metric');
        container.innerHTML = '<div class="alert alert-info">Please select a category, company, and metric, then click "Analyze Correlation" to view the visualization</div>';
        return;
    }

    try {
        // Show loading state
        analyzeButton.disabled = true;
        container.innerHTML = '<div class="alert alert-info">Loading financial data...</div>';

        // Fetch real financial data
        const financialData = fetchFinancialData(company, metric);
        
        financialData.then(data => {
            if (data && data.length > 0) {
                const title = `${company.toUpperCase()} - ${metric.replace(/_/g, ' ').toUpperCase()}`;
                createVisualization(data, 'techVisualization', title, metric);
            } else {
                container.innerHTML = '<div class="alert alert-warning">No financial data available for the selected company</div>';
            }
        }).catch(error => {
            console.error('Error in updateTechVisualization:', error);
            container.innerHTML = `<div class="alert alert-danger">Error fetching financial data: ${error.message}</div>`;
        }).finally(() => {
            // Re-enable the analyze button
            analyzeButton.disabled = false;
        });
    } catch (error) {
        console.error('Error in updateTechVisualization:', error);
        container.innerHTML = `<div class="alert alert-danger">Error fetching financial data: ${error.message}</div>`;
    }
}

// Function to update agriculture visualization with real weather data
async function updateAgricultureVisualization() {
    const cropType = document.getElementById('cropType').value;
    const region = document.getElementById('region').value;
    const metric = document.getElementById('weatherMetric').value;
    const container = document.getElementById('agricultureVisualization');
    const analyzeButton = document.getElementById('analyzeAgriculture');

    if (!container) {
        console.error('Agriculture visualization container not found!');
        return;
    }

    if (!cropType || !region || !metric) {
        console.log('Please select crop type, region, and metric');
        container.innerHTML = '<div class="alert alert-info">Please select a crop type, region, and weather metric, then click "Analyze Correlation" to view the visualization</div>';
        return;
    }

    try {
        // Show loading state
        analyzeButton.disabled = true;
        container.innerHTML = '<div class="alert alert-info">Loading weather data...</div>';

        // Fetch real weather data
        const weatherData = await fetchWeatherData(region, metric);
        
        if (weatherData && weatherData.length > 0) {
            const title = `${cropType.toUpperCase()} - ${region} - ${metric.replace(/_/g, ' ').toUpperCase()}`;
            createVisualization(weatherData, 'agricultureVisualization', title, metric);
        } else {
            container.innerHTML = '<div class="alert alert-warning">No weather data available for the selected region</div>';
        }
    } catch (error) {
        console.error('Error in updateAgricultureVisualization:', error);
        container.innerHTML = `<div class="alert alert-danger">Error fetching weather data: ${error.message}</div>`;
    } finally {
        // Re-enable the analyze button
        analyzeButton.disabled = false;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check if Plotly is loaded
    if (typeof Plotly === 'undefined') {
        console.error('Plotly library is not loaded!');
        return;
    }

    // Restore active tab from localStorage
    const activeTabId = localStorage.getItem('activeTab');
    if (activeTabId) {
        const tabElement = document.querySelector(`button[data-bs-target="${activeTabId}"]`);
        if (tabElement) {
            const tab = new bootstrap.Tab(tabElement);
            tab.show();
        }
    }

    // Add event listener for tab changes
    const tabElements = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabElements.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            const targetId = event.target.getAttribute('data-bs-target');
            localStorage.setItem('activeTab', targetId);
        });
    });

    // Set up event listeners for tech tab
    const techCategorySelect = document.getElementById('techCategory');
    if (techCategorySelect) {
        techCategorySelect.addEventListener('change', function() {
            console.log('Category changed:', this.value);
            updateCompanyDropdown(this.value);
            validateTechSelections();
            // Clear the visualization when category changes
            const container = document.getElementById('techVisualization');
            if (container) {
                container.innerHTML = '<div class="alert alert-info">Please select a company and click "Analyze Correlation" to view the visualization</div>';
            }
        });
    }
    
    const techCompanySelect = document.getElementById('techCompany');
    if (techCompanySelect) {
        techCompanySelect.addEventListener('change', function() {
            console.log('Company changed:', this.value);
            validateTechSelections();
        });
    }

    const financialMetricSelect = document.getElementById('financialMetric');
    if (financialMetricSelect) {
        financialMetricSelect.addEventListener('change', function() {
            console.log('Metric changed:', this.value);
            validateTechSelections();
        });
    }

    // Set up event listeners for agriculture tab
    const cropTypeSelect = document.getElementById('cropType');
    if (cropTypeSelect) {
        cropTypeSelect.addEventListener('change', function() {
            console.log('Crop type changed:', this.value);
            updateRegionDropdown(this.value);
            validateAgricultureSelections();
            // Clear the visualization when crop type changes
            const container = document.getElementById('agricultureVisualization');
            if (container) {
                container.innerHTML = '<div class="alert alert-info">Please select a region and click "Analyze Correlation" to view the visualization</div>';
            }
        });
    }

    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            console.log('Region changed:', this.value);
            validateAgricultureSelections();
        });
    }

    const weatherMetricSelect = document.getElementById('weatherMetric');
    if (weatherMetricSelect) {
        weatherMetricSelect.addEventListener('change', function() {
            console.log('Weather metric changed:', this.value);
            validateAgricultureSelections();
        });
    }

    // Set up analyze button event listeners
    const analyzeTechButton = document.getElementById('analyzeTech');
    if (analyzeTechButton) {
        analyzeTechButton.addEventListener('click', updateTechVisualization);
        analyzeTechButton.disabled = true;
    }

    const analyzeAgricultureButton = document.getElementById('analyzeAgriculture');
    if (analyzeAgricultureButton) {
        analyzeAgricultureButton.addEventListener('click', updateAgricultureVisualization);
        analyzeAgricultureButton.disabled = true;
    }

    // Initialize dropdowns as disabled
    if (techCompanySelect) {
        techCompanySelect.disabled = true;
    }
    if (regionSelect) {
        regionSelect.disabled = true;
    }

    // Show initial messages
    const techContainer = document.getElementById('techVisualization');
    if (techContainer) {
        techContainer.innerHTML = '<div class="alert alert-info">Please select a category, company, and metric, then click "Analyze Correlation" to view the visualization</div>';
    }

    const agricultureContainer = document.getElementById('agricultureVisualization');
    if (agricultureContainer) {
        agricultureContainer.innerHTML = '<div class="alert alert-info">Please select a crop type, region, and weather metric, then click "Analyze Correlation" to view the visualization</div>';
    }
});
