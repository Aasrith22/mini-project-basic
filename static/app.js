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

// Function to populate company dropdown based on selected category
function updateCompanyDropdown(category) {
    const companySelect = document.getElementById('techCompany');
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

// Function to update tech visualization
function updateTechVisualization() {
    const category = document.getElementById('techCategory').value;
    const company = document.getElementById('techCompany').value;
    const metric = document.getElementById('financialMetric').value;
    
    if (!category || !company || !metric) return;
    
    const data = generateTechData(category, company, metric);
    const title = `${metric.replace(/_/g, ' ').toUpperCase()} Analysis for ${company}`;
    const yAxisLabel = metric.replace(/_/g, ' ').toUpperCase();
    
    createVisualization(data, 'techVisualization', title, metric, yAxisLabel);
}

// Function to update agriculture visualization
function updateAgricultureVisualization() {
    const crop = document.getElementById('crop').value;
    const region = document.getElementById('region').value;
    const metric = document.getElementById('weatherMetric').value;
    
    if (!crop || !region || !metric) return;
    
    const data = generateAgricultureData(crop, region, metric);
    const title = `${metric.toUpperCase()} Analysis for ${crop} in ${region}`;
    const yAxisLabel = `${metric.toUpperCase()} ${weatherMetrics[metric]}`;
    
    createVisualization(data, 'agricultureVisualization', title, metric, yAxisLabel);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Tech & Finance event listeners
    const techCategory = document.getElementById('techCategory');
    const techCompany = document.getElementById('techCompany');
    const financialMetric = document.getElementById('financialMetric');
    const analyzeTechBtn = document.getElementById('analyzeTech');
    
    if (techCategory) {
        techCategory.addEventListener('change', function() {
            updateCompanyDropdown(this.value);
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
        cropSelect.addEventListener('change', function() {
            updateRegionDropdown(this.value);
            validateAgricultureSelections();
        });
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
