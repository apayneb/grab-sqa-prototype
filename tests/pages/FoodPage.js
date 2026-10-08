class FoodPage {
    constructor(page) {
        this.page = page;
        this.orderButton = page.locator('#btn-order-food');
        this.statusText = page.locator('#food-status');
    }

    async navigate() {
        await this.page.goto('/');
    }

    async clickOrderFood() {
        await this.orderButton.click();
    }
}
module.exports = FoodPage;