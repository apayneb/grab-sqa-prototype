const { test, expect } = require('@playwright/test');
const FoodPage = require('./pages/FoodPage');

test.describe('Food Ordering Core Workflow', () => {
    test('FO-001: Should successfully order food and show CONFIRMED status', async ({ page }) => {
        const foodPage = new FoodPage(page);

        await foodPage.navigate();

        // ยืนยันว่า UI เรียก Order API จริง และ API ตอบ 200
        const [apiResponse] = await Promise.all([
            page.waitForResponse((res) => res.url().endsWith('/api/order') && res.request().method() === 'POST'),
            foodPage.clickOrderFood(),
        ]);
        expect(apiResponse.status()).toBe(200);

        // ตรวจสอบว่าระบบแสดงข้อความ CONFIRMED ภายในเวลาที่กำหนด
        await expect(foodPage.statusText).toHaveText('CONFIRMED', { timeout: 2000 });
    });

    test('FO-002: Food API should reject an order with missing required data (HTTP 400)', async ({ request }) => {
        // ส่ง order ที่ไม่มี items และ paymentMethod
        const response = await request.post('/api/order', {
            data: { restaurantId: 'R-001' },
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.status).toBe('REJECTED');
        expect(body.fields).toEqual(expect.arrayContaining(['items', 'paymentMethod']));
    });
});
