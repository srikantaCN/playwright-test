import { test, expect } from '@playwright/test';

test('Validate API response after login and navigation', async ({ page, request }) => {
    await page.goto('https://digycloud.digy4.com');
    await page.click('text=LOGIN WITHOUT SINGLE SIGN ON');
    await page.locator("//input[@id='userName']").fill('demo.user');
    await page.locator("//input[@id='password']").fill('Digy4101!');
    await page.click('button:has-text("Login")');
    await page.waitForURL('https://digycloud.digy4.com/');

    const authToken = await page.evaluate(() => {
        const authData = localStorage.getItem('persist:auth');
        if (authData) {
            const parsedData = JSON.parse(authData);
            const userAuthData = JSON.parse(parsedData.userAuthData || '{}');
            return userAuthData.token;
        }
        return null;
    });

    console.log(`Auth Token: ${authToken}`);
    expect(authToken).not.toBeNull();

    await page.click('text=Integration Hub for Tools and Apps');
    await page.waitForURL('https://digycloud.digy4.com/integrations');
    await page.click('text=Show Connection');
    await page.waitForURL(
        'https://digycloud.digy4.com/connections?connectionType=CXOFORM'
    );

    const apiUrl =
        'https://e4ud44gb9c.execute-api.us-west-2.amazonaws.com/prod/app_connection?user_name=digy4user&application_name=CXOFORM';

    const apiResponse = await page.evaluate(async ({ url, token }) => {
        console.log(`Fetching from: ${url} with token: ${token}`);
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const textResponse = await response.text();
                console.log(`Raw API Response (Attempt ${attempt}): ${textResponse}`);

                if (!response.ok) {
                    throw new Error(
                        `Request failed with status: ${response.status}, Response: ${textResponse}`
                    );
                }

                return JSON.parse(textResponse);
            } catch (error) {
                console.warn(`Attempt ${attempt} failed: ${error.message}`);
                if (attempt === 3) throw error; // Fail after max retries
            }
        }
        return null; // This will never execute
    }, { url: apiUrl, token: authToken });


    console.log('API Response:', apiResponse);
    expect(apiResponse.length).toBeGreaterThan(0);
    const firstRecord = apiResponse[0];
    expect(firstRecord.connection_name).toBe('digy4 digycloud');
    await page.waitForTimeout(10000);
    const tableLocator = page.locator("tbody tr:nth-child(1) td:nth-child(1) div:nth-child(1)");

    // Wait for the table cell's text to become non-empty
    await tableLocator.waitFor({
        state: 'visible',
        timeout: 10000, // Adjust timeout if necessary
    });

    // Assert the table content after waiting
    const tableFirstRowConnectionName = await tableLocator.textContent();
    console.log(`Table First Row Content: ${tableFirstRowConnectionName}`);
    expect(tableFirstRowConnectionName?.trim()).toBe('Digy4 digycloud');

});


test.only('Validate connection_name in API response after login and navigation', async ({ page }) => {
    // Step 1: Visit the URL
    await page.goto('https://digycloud.digy4.com');

    // Step 2: Click on "LOGIN WITHOUT SINGLE SIGN ON"
    await page.click('text=LOGIN WITHOUT SINGLE SIGN ON');

    // Step 3: Fill in the username
    await page.locator("//input[@id='userName']").fill('demo.user');

    // Step 4: Fill in the password
    await page.locator("//input[@id='password']").fill('Digy4101!');

    // Step 5: Click on "Login" button
    await page.click('button:has-text("Login")');
    await page.waitForURL('https://digycloud.digy4.com/');


    // Step 6: Navigate to the Integration Hub
    await page.waitForLoadState('networkidle');
    // //a[@href='/integrations']
    const showHubText = await page.locator('//p[contains(text(), "Integration Hub for Tools and Apps")]');
    // const showHubText = await page.locator('text=Integration Hub for Tools and AppsEasily connect and use your tools across all Digy4 apps from a sin');
    await showHubText.waitFor({ state: 'visible' });
    await showHubText.click();
    // await page.click('text=Integration Hub for Tools and Apps');
    await page.waitForURL('https://digycloud.digy4.com/integrations');

    // Step 7: Click on "Show Connection" on the first card
    await page.waitForLoadState('networkidle');
    const showConnectionButton = await page.locator('text=Show Connection').first();
    await showConnectionButton.waitFor({ state: 'visible' });
    await showConnectionButton.click();

    await page.waitForURL('https://digycloud.digy4.com/connections?connectionType=CXOFORM');

    // Step 8: Wait for APIs to respond successfully
    const [response] = await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('https://e4ud44gb9c.execute-api.us-west-2.amazonaws.com/prod/app_connection?user_name=digy4user') &&
            response.status() === 200
        ),
        page.waitForLoadState('networkidle'),
    ]);

    // Step 9: Validate "connection_name" in the API response
    const responseBody = await response.json();
    console.log({ responseBody })
    const firstConnectionName = responseBody?.[0]?.connection_name;

    // Assertion
    expect(firstConnectionName).toBe('digy4 digycloud');

    const tableLocator = await page.locator("tbody tr:nth-child(1) td:nth-child(1) div:nth-child(1)");

    // Wait for the table cell's text to become non-empty
    await tableLocator.waitFor({
        state: 'visible',
        timeout: 10000, // Adjust timeout if necessary
    });

    // Assert the table content after waiting
    const tableFirstRowConnectionName = await tableLocator.textContent();
    console.log(`Table First Row Content: ${tableFirstRowConnectionName}`);
    expect(tableFirstRowConnectionName?.trim()).toBe('Digy4 digycloud');
});
