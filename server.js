const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ไม่เปิดเผยว่าใช้ Express ผ่าน header X-Powered-By (SonarQube S5689)
app.disable('x-powered-by');

app.use(express.static('public'));
app.use(express.json());

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

// ตรวจข้อมูลที่จำเป็นของ request — คืนรายชื่อ field ที่ขาดหรือไม่ถูกต้อง
function validateOrder(body = {}) {
    const errors = [];
    if (!isNonEmptyString(body.restaurantId)) errors.push('restaurantId');
    if (!Array.isArray(body.items) || body.items.length === 0) errors.push('items');
    if (!isNonEmptyString(body.paymentMethod)) errors.push('paymentMethod');
    return errors;
}

function validateRide(body = {}) {
    const errors = [];
    if (!isNonEmptyString(body.pickup)) errors.push('pickup');
    if (!isNonEmptyString(body.destination)) errors.push('destination');
    if (!isNonEmptyString(body.rideType)) errors.push('rideType');
    return errors;
}

// Mock API Endpoints สำหรับจำลองการทำงาน
app.post('/api/order', (req, res) => {
    const missing = validateOrder(req.body);
    if (missing.length > 0) {
        return res.status(400).json({ status: 'REJECTED', error: 'Missing required data', fields: missing });
    }
    res.status(200).json({ status: 'CONFIRMED', message: 'Food order successful' });
});

app.post('/api/ride', (req, res) => {
    const missing = validateRide(req.body);
    if (missing.length > 0) {
        return res.status(400).json({ status: 'REJECTED', error: 'Missing required data', fields: missing });
    }
    res.status(200).json({ status: 'CONFIRMED', message: 'Ride booked successful' });
});

// ข้อมูลจำลอง (Simulated) สำหรับ Quality Metrics Dashboard — ไม่ใช่ข้อมูลจริงของ Grab
// สร้างแบบ deterministic เพื่อให้ dashboard แสดงค่าเดิมทุกครั้งที่โหลด
function buildSimulatedMetrics(weeks = 12) {
    const services = {
        food: { kloc: 18.4, baseDeploys: 9, baseDefects: 14 },
        ride: { kloc: 22.7, baseDeploys: 7, baseDefects: 19 },
    };
    const start = new Date(Date.UTC(2026, 6, 13)); // สัปดาห์แรกของช่วงจำลอง (จันทร์)
    const rows = [];
    for (let w = 0; w < weeks; w++) {
        const weekStart = new Date(start.getTime() + w * 7 * 86400000).toISOString().slice(0, 10);
        const progress = w / (weeks - 1); // 0 → 1: ผลของ SQA Transformation ที่ค่อยๆ ดีขึ้น
        for (const [service, s] of Object.entries(services)) {
            const wobble = Math.round(Math.sin(w * 1.7 + s.kloc) * 1.5);
            const deployments = s.baseDeploys + Math.round(progress * 6) + wobble;
            rows.push({
                week: weekStart,
                service,
                deployments,
                failedDeployments: Math.max(0, Math.round(deployments * (0.18 - progress * 0.11)) + (w % 4 === 1 ? 1 : 0)),
                leadTimeHours: Math.round((52 - progress * 30 + wobble * 2) * 10) / 10,
                mttrHours: Math.round((6.5 - progress * 3 + Math.abs(wobble) * 0.4) * 10) / 10,
                defectsFound: Math.max(2, Math.round(s.baseDefects * (1 - progress * 0.45)) + wobble),
                kloc: s.kloc,
                escapedCriticalDefects: progress > 0.6 ? (w % 5 === 0 ? 1 : 0) : (w % 3 === 0 ? 2 : 1),
                criticalRegressionCases: 40,
                automatedRegressionCases: Math.min(40, 18 + Math.round(progress * 17) + (wobble > 0 ? 1 : 0)),
                criticalVulnerabilities: progress < 0.35 ? 1 : 0,
            });
        }
    }
    return rows;
}

app.get('/api/metrics', (req, res) => {
    res.json({ simulated: true, generatedFor: 'Grab SQA Reference Prototype', weeks: buildSimulatedMetrics() });
});

app.listen(port, () => {
    console.log(`Mock App listening at http://localhost:${port}`);
});
