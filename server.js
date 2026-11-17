const http = require("node:http");
const { readFile } = require("node:fs/promises");
const { join } = require("node:path");

const port = Number(process.env.PORT) || 3000;
const pagePath = join(__dirname, "index.html");

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname !== "/" && pathname !== "/index.html") {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  try {
    const page = await readFile(pagePath);
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": page.length,
      "Cache-Control": "public, max-age=300",
    });
    response.end(request.method === "HEAD" ? undefined : page);
  } catch (error) {
    console.error("Não foi possível carregar index.html:", error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Erro interno do servidor");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Site disponível na porta ${port}`);
});
