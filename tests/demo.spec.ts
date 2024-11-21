// post-modify-cache.test.ts
import { test } from '../fixtures';

test('POST request with caching and modification', async ({ page, cacheRoute }) => {
    // Step 1: Cache a POST request to jsonplaceholder API
    await cacheRoute.GET('https://jsonplaceholder.typicode.com/posts/1', {
        // body: JSON.stringify({
        //     title: 'Test Title',
        //     body: 'This is a test body updated.',
        //     userId: 1,
        // }),
        // headers: {
        //     'Content-type': 'application/json; charset=UTF-8',
        // },
        modify: async (route, response) => {
            // Step 2: Modify the cached response for testing
            const json = await response.json();
            json.title = 'post'; // Modify the title field
            json.id = 1; // Add a custom ID to validate modified data
            await route.fulfill({ json });
        },
    });

    // Step 3: Verify that the modified cached response is used
    const response = await page.evaluate(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'GET',
            // body: JSON.stringify({
            //     title: 'Test Title',
            //     body: 'This is a test body updated.',
            //     userId: 1,
            // }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        return res.json();
    });

    // Step 4: Assertions to verify the modified response is returned
    test.expect(response.title).toBe('post');
    test.expect(response.id).toBe(1);
});
