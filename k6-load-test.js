import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export let options = {
    stages: [
        { duration: '10s', target: 10 }, // Ramp-up จำนวน User ไปที่ 10 คน ภายใน 10 วินาที
        { duration: '15s', target: 10 }, // คงที่ 10 Users เป็นเวลา 15 วินาที
        { duration: '5s', target: 0 },   // Ramp-down จำนวน User กลับมาที่ 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% ของ Request ต้องตอบสนองเร็วกว่า 2 วินาที (P95)
        http_req_failed: ['rate<0.01'],    // Error Rate ต้องน้อยกว่า 1%
    },
};

const jsonHeaders = { headers: { 'Content-Type': 'application/json' } };

export default function () {
    let res = http.get(BASE_URL);
    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    // จำลองการยิง API ด้วยข้อมูลที่ครบ (server ตอบ 400 ถ้าข้อมูลไม่ครบ)
    let orderRes = http.post(`${BASE_URL}/api/order`, JSON.stringify({
        restaurantId: 'R-001',
        items: [{ menuId: 'M-001', qty: 1 }],
        paymentMethod: 'GrabPay',
    }), jsonHeaders);
    check(orderRes, {
        'order API status is 200': (r) => r.status === 200,
    });

    let rideRes = http.post(`${BASE_URL}/api/ride`, JSON.stringify({
        pickup: 'Siam Paragon',
        destination: 'Chatuchak',
        rideType: 'GrabCar',
    }), jsonHeaders);
    check(rideRes, {
        'ride API status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
