import http, { IncomingMessage, ServerResponse } from "node:http";

const HOSTNAME = "localhost";
const PORT = 5000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => 
{
    
    const method = req.method ?? "GET";

    // http://localhost:5001/users -> req.url: /users
    //  http://localhost:5001/users?id=1 -> req.url: /users?id=1

    const requestUrl = new URL(req.url ?? "/", `http:${req.headers.host}`);
    const pathName = requestUrl.pathname;

    res.setHeader("Content-Type", "text/plain");

    if (method === "GET" && pathName === "/health") 
    {
        res.statusCode = 200;
        res.end("server is healthy");
        return;
    }

    if (method === "GET" && pathName === "/users") 
    {
        res.statusCode = 200;
        res.end("List of users");
        return;
    }

    if (method === "POST" && pathName === "/users") 
    {
        res.statusCode = 201;
        res.end("user created successfully!!!!!");
        return;
    }

    res.statusCode = 404;
    //404 -> not found here
    res.end("route not found");
    
},);

// Server Start
server.listen(PORT, HOSTNAME, () => 
{
  console.log(`✅ Server is now running at http://${HOSTNAME}:${PORT}`);
});


// Error Handling
server.on("error", (err: NodeJS.ErrnoException) => 
{
    if (err.code === "EADDRINUSE") 
    {
        console.error(`❌ Port ${PORT} is already in use.`);
    } 
    else if (err.code === "EACCES") 
    {
        console.error(`❌ Permission denied to use port ${PORT}.`);
    } 
    else 
    {
        console.error("❌ Server Error:", err);
    }
    
});