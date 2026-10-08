class RidePage {
    constructor(page) {
        this.page = page;
        this.bookButton = page.locator('#btn-book-ride');
        this.statusText = page.locator('#ride-status');
    }

    async navigate() {
        await this.page.goto('/');
    }

    async clickBookRide() {
        await this.bookButton.click();
    }
}
module.exports = RidePage;