# Data Visualization Platform

A responsive web application for visualizing and analyzing correlations between technology, finance, agriculture, and weather data.

## Features

- **Technology & Finance Analysis**
  - View stock prices, market cap, trading volume, and volatility for major tech companies
  - Real-time data from Alpha Vantage API
  - Interactive visualizations using Plotly

- **Agriculture & Weather Analysis**
  - Track weather metrics (temperature, rainfall, humidity) across different regions
  - Real-time weather data from OpenWeather API
  - Analyze correlations with crop data

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/data-viz-platform.git
   cd data-viz-platform
   ```

2. Configure API Keys:
   - Get an API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Get an API key from [OpenWeather](https://openweathermap.org/api)
   - Update the keys in `static/config.js`

3. Run the application:
   - Open `index.html` in a web browser
   - For local development, use a local server to avoid CORS issues

## Technologies Used

- HTML5, CSS3, JavaScript
- Bootstrap 5.1.3 for responsive design
- Plotly 2.27.0 for data visualization
- Alpha Vantage API for financial data
- OpenWeather API for weather data

## Project Structure

```
data-viz-platform/
├── static/
│   ├── app.js         # Main application logic
│   ├── config.js      # API configuration
│   ├── styles.css     # Custom styles
│   └── index.html     # Main HTML file
└── README.md          # Documentation
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
