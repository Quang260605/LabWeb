const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const DIR = __dirname;
const IMAGES_DIR = 'C:\\Users\\nguye\\OneDrive\\Pictures\\NSHM_PHOTO';

// Helper function to get random image
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
        console.error('Error reading images directory:', err);
        return null;
    }
}

const server = http.createServer((req, res) => {
    // Parse URL
    let pathname = url.parse(req.url).pathname;
    
    // API endpoint for random image
    if (pathname === '/api/random-image') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const imageName = getRandomImage();
        res.end(JSON.stringify({ image: imageName || null }));
        return;
    }
    
    // API endpoint for image from NSHM_PHOTO
    if (pathname.startsWith('/image/')) {
        const imageName = pathname.substring('/image/'.length);
        // Security: prevent directory traversal
        if (imageName.includes('..') || imageName.includes('/')) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }
        const imagePath = path.join(IMAGES_DIR, imageName);
        fs.stat(imagePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            const ext = path.extname(imagePath).toLowerCase();
            const contentTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            };
            const contentType = contentTypes[ext] || 'application/octet-stream';
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Server Error');
                    return;
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        });
        return;
    }
    
    if (pathname === '/') pathname = '/index.html';

    // File path
    let filePath = path.join(DIR, pathname);

    // Security: prevent directory traversal
    const realPath = path.resolve(filePath);
    const realDir = path.resolve(DIR);
    if (!realPath.startsWith(realDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'text/javascript; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';

        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Server Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Server started successfully!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📁 Directory: ${DIR}`);
    console.log(`⏹️  Press Ctrl+C to stop server\n`);
});
