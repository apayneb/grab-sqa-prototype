const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,          // กัน test.only หลุดเข้า CI
    retries: process.env.CI ? 1 : 0,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
    ],
    use: {
        baseURL: BASE_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    // Playwright เปิด mock server ให้เองก่อนรันเทสต์ และรอจน server พร้อม
    webServer: {
        command: 'npm start',
        url: BASE_URL,
        env: { PORT: String(PORT) },
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
    },
});
