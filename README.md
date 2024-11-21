# Playwright Automation: API Response Validation and Navigation Testing

This project contains Playwright test scripts for automating the validation of API responses and navigation in a web application. The tests include logging into the application, navigating through various pages, verifying API responses, and ensuring the correct data is displayed on the UI.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Tests](#tests)
- [Project Structure](#project-structure)
- [License](#license)

---

## Installation

To get started with this project, ensure you have the following prerequisites installed on your system:

- [Node.js 20](https://nodejs.org/) or later
- [Playwright](https://playwright.dev/)

Clone the repository and install dependencies:

```bash
git clone https://github.com/srikantaCN/playwright-test
cd playwright-test
npm install
```
## Setup
Before running the tests, ensure the following setup is completed:

Environment Configuration: Update any required environment variables or URLs directly in the test scripts if necessary.
Install Browsers: Install Playwright browsers by running:
```bash
npx playwright install
```
## Usage
Run the Playwright tests with the following command:
```bash
npx playwright test
```
# Tests
## Test: Validate API Response After Login and Navigation
This test performs the following actions:

- Login to the Application: Automates user login using username and password.
- Navigation: Clicks through the application to reach the "Integration Hub" and "Show Connection" pages.
- API Validation: Fetches an API response and validates the connection_name field.
- UI Validation: Ensures the table data matches the API response.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Please create a pull request with a detailed description of your changes. Ensure all tests pass before submitting.

## Notes
- Ensure your network is stable when running tests, as they involve API calls and network-intensive operations.
- Adjust timeouts or selectors in the test files if your application has dynamic loading behaviors.
