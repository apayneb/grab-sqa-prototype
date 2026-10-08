class DashboardPage {
    constructor(page) {
        this.page = page;
        this.doraTiles = page.locator('#tiles-dora .tile');
        this.qualityTiles = page.locator('#tiles-quality .tile');
        this.serviceFilter = page.locator('#f-service');
        this.densityLegend = page.locator('#chart-density .legend span');
        this.gateRows = page.locator('#gates tbody tr');
    }

    async navigate() {
        await this.page.goto('/dashboard.html');
    }

    tile(label) {
        return this.page.locator('.tile', { has: this.page.locator('.label', { hasText: label }) });
    }

    async filterService(value) {
        await this.serviceFilter.selectOption(value);
    }
}
module.exports = DashboardPage;
