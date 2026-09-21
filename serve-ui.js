const http = require("http");
const fs = require("fs");
const path = require("path");

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
};

const PORT = 5500;
const root = __dirname;

http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
    const filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);

    if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not found");
            return;
        }
        const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`Interface running on http://localhost:${PORT}`);
});
