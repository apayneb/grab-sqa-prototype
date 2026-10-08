const { test, expect } = require('@playwright/test');
const DashboardPage = require('./pages/DashboardPage');

test.describe('Quality Metrics Dashboard', () => {
    test('DB-001: Should show DORA and quality metrics including Defect Density', async ({ page }) => {
        const dashboard = new DashboardPage(page);

        await dashboard.navigate();

        await expect(dashboard.doraTiles).toHaveCount(4);
        await expect(dashboard.qualityTiles).toHaveCount(4);
        await expect(dashboard.tile('Defect Density').locator('.value')).toContainText('defects/KLOC');
        await expect(dashboard.gateRows).toHaveCount(6);
    });

    test('DB-002: Service filter should scope charts to the selected service', async ({ page }) => {
        const dashboard = new DashboardPage(page);

        await dashboard.navigate();
        await expect(dashboard.densityLegend).toHaveText(['Food Ordering', 'Ride Booking']);

        await dashboard.filterService('ride');
        await expect(dashboard.densityLegend).toHaveText(['Ride Booking']);
    });
});
