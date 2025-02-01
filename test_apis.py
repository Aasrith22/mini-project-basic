import requests
import json

BASE_URL = 'http://localhost:5000'

def test_endpoint(endpoint):
    print(f"\nTesting {endpoint}...")
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Data received: {json.dumps(data, indent=2)[:500]}...")
            print(f"Number of data points: {len(data)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")

def main():
    # Test each endpoint
    test_endpoint('/api/weather')
    test_endpoint('/api/financial')
    test_endpoint('/api/health')
    test_endpoint('/api/tech')

if __name__ == '__main__':
    main()
