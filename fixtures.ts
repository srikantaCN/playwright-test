// test.ts
import { test as base } from '@playwright/test';
import { CacheRoute } from 'playwright-network-cache';

type Fixtures = {
    cacheRoute: CacheRoute;
};

export const test = base.extend<Fixtures>({
    cacheRoute: async ({ page }, use) => {
        await use(new CacheRoute(page, { baseDir: '.network-cache' }));
    },
});
