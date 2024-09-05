const http = require("http");
const fs = require("fs");
const path = require("path");

const indexPath = path.join("public", "index.html");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(`Request received: ${method} ${url}`);

  if (url === "/" && method === "GET") {
    fs.readFile(indexPath, "utf8", (err, data) => {
      if (err) {
        res.end("404 Not Found");
      } else {
        res.end(data);
        console.log("Served index.html (async)");
      }
    });
  } else {
    res.end("404 Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});