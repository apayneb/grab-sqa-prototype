const { test, expect } = require('@playwright/test');
const RidePage = require('./pages/RidePage');

test.describe('Ride Booking Core Workflow', () => {
    test('RB-001: Should successfully book a ride and show CONFIRMED status', async ({ page }) => {
        const ridePage = new RidePage(page);

        await ridePage.navigate();

        // ยืนยันว่า UI เรียก Ride API จริง และ API ตอบ 200
        const [apiResponse] = await Promise.all([
            page.waitForResponse((res) => res.url().endsWith('/api/ride') && res.request().method() === 'POST'),
            ridePage.clickBookRide(),
        ]);
        expect(apiResponse.status()).toBe(200);

        // ตรวจสอบว่าระบบแสดงข้อความ CONFIRMED ภายในเวลาที่กำหนด
        await expect(ridePage.statusText).toHaveText('CONFIRMED', { timeout: 2000 });
    });

    test('RB-002: Ride API should reject a booking with missing required data (HTTP 400)', async ({ request }) => {
        // ส่ง booking ที่ไม่มี destination และ rideType
        const response = await request.post('/api/ride', {
            data: { pickup: 'Siam Paragon' },
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.status).toBe('REJECTED');
        expect(body.fields).toEqual(expect.arrayContaining(['destination', 'rideType']));
    });
});
