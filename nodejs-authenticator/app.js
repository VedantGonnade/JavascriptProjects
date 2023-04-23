import http from "http";

//create a server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost:3000");
  //console.log(url)
  if (req.method === "GET" && req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Hello World From GET</h1>");
    res.end();
    return;
  } else if (req.method === "POST" && req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Hello World from POST</h1>");
    res.end();
    return;
  } else if (req.method === "GET" && url.pathname === "/me") {
    const getName = url.searchParams.get("name");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>" + getName + "</h1>");
    res.end();
    return;
  } else if (req.method === "GET" && url.pathname === "/me/hello") {
    const getName = url.searchParams.get("name");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>hello" + getName + "</h1>");
    res.end();
    return;
  } else if (req.method === "GET" && url.pathname === "/me/Vedant") {
    const getName = url.pathname.substring(4);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>" + getName + "</h1>");
    res.end();
    return;
  } else if (req.method === "GET" && url.pathname === "/me/hello/Vedant") {
    const getName = url.pathname.split("/").pop();
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1> hello " + getName + "</h1>");
    res.end();
    return;
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found\n");
  }
});

server.listen(3000, (err, res) => {
  if (err) {
    return console.log("something bad happened", err);
  } else {
    console.log("reading on http://localhost:3000");
    console.log("server start at port 3000");
  }
});
