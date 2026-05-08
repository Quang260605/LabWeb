const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const DIR = __dirname;
const IMAGES_DIR = 'C:\\Users\\nguye\\OneDrive\\Pictures\\NSHM_PHOTO';

// Đếm số lượng SV đăng ký theo từng chuyên ngành (in-memory)
const dangKyCount = {};

function getRandomImage() {
    try {
        const files = fs.readdirSync(IMAGES_DIR);
        const imageFiles = files.filter(f => {
            const ext = path.extname(f).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });
        if (imageFiles.length === 0) return null;
        return imageFiles[Math.floor(Math.random() * imageFiles.length)];
    } catch (err) {
        return null;
    }
}

// Parse POST body
function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const result = {};
            for (const [k, v] of params.entries()) result[k] = v;
            resolve(result);
        });
    });
}

const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // ── API: random image ──
    if (pathname === '/api/random-image') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ image: getRandomImage() || null }));
        return;
    }

    // ── API: serve image ──
    if (pathname.startsWith('/image/')) {
        const imageName = pathname.substring('/image/'.length);
        if (imageName.includes('..') || imageName.includes('/')) {
            res.writeHead(403); res.end('Forbidden'); return;
        }
        const imagePath = path.join(IMAGES_DIR, imageName);
        fs.stat(imagePath, (err, stats) => {
            if (err || !stats.isFile()) { res.writeHead(404); res.end('Not Found'); return; }
            const ext = path.extname(imagePath).toLowerCase();
            const ct = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.gif':'image/gif','.webp':'image/webp' };
            res.writeHead(200, { 'Content-Type': ct[ext] || 'application/octet-stream' });
            fs.createReadStream(imagePath).pipe(res);
        });
        return;
    }

    // ══════════════════════════════════════════════════
    //  STUDENT ROUTES — Đăng ký chuyên ngành (Buổi 8/5)
    // ══════════════════════════════════════════════════

    // Route: GET /Student/ hoặc /Student/index.html
    if (req.method === 'GET' && (pathname === '/Student/' || pathname === '/Student' || pathname === '/Student/index.html')) {
        const filePath = path.join(DIR, 'Student', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) { res.writeHead(404); res.end('Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
        return;
    }

    // Route: GET /Student/ShowKQ (hiển thị kết quả từ query string)
    if (req.method === 'GET' && pathname === '/Student/ShowKQ') {
        const filePath = path.join(DIR, 'Student', 'ShowKQ.html');
        fs.readFile(filePath, (err, data) => {
            if (err) { res.writeHead(404); res.end('Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
        return;
    }

    // Route: POST /Student/ShowKQ  (Form đăng ký chuyên ngành)
    if (req.method === 'POST' && pathname === '/Student/ShowKQ') {
        const body = await parseBody(req);
        const mssv        = body.mssv        || '';
        const hoten       = body.hoten       || '';
        const diemtb      = body.diemtb      || '';
        const chuyennganh = body.chuyennganh || '';

        // Đếm số SV đăng ký theo chuyên ngành
        if (chuyennganh) {
            dangKyCount[chuyennganh] = (dangKyCount[chuyennganh] || 0) + 1;
        }
        const soLuong = dangKyCount[chuyennganh] || 1;

        // Redirect sang ShowKQ với query string
        const qs = new URLSearchParams({ mssv, hoten, diemtb, chuyennganh, soLuong });
        res.writeHead(302, { 'Location': `/Student/ShowKQ?${qs.toString()}` });
        res.end();
        return;
    }

    // ══════════════════════════════════════════════════

    // Default: serve static files
    let filePath = path.join(DIR, pathname === '/' ? 'index.html' : pathname);
    const realPath = path.resolve(filePath);
    const realDir  = path.resolve(DIR);
    if (!realPath.startsWith(realDir)) {
        res.writeHead(403); res.end('Forbidden'); return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) { res.writeHead(404); res.end('404 Not Found'); return; }
        const ext = path.extname(filePath).toLowerCase();
        const ct = {
            '.html': 'text/html; charset=utf-8',
            '.css':  'text/css; charset=utf-8',
            '.js':   'text/javascript; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.jpg':  'image/jpeg', '.jpeg': 'image/jpeg',
            '.png':  'image/png',  '.gif':  'image/gif',
            '.svg':  'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': ct[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Server started!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🎓 Student demo: http://localhost:${PORT}/Student/`);
    console.log(`⏹️  Ctrl+C to stop\n`);
});
