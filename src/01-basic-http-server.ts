import http, { IncomingMessage, ServerResponse } from "node:http";

const HOSTNAME = "localhost";
const PORT = 5000;


// http.createServer create low level http server
// callback is going to run for every incoming http req

// req -> request object

// method - get, post, put, options, delete
// / , /users
// headers - actual metaadata sent by the clent
// req body -> data post/put

// res -> response object
// status code, response headers , response body

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => 
{
    const method = req.method;

    // get -> read data
    // post -> create data
    // put -> replace data
    // patch -> update partial data
    // delete -> delete data

    const url = req.url;
    // in which path the client is actually requesting

    const userAgent = req.headers["user-agent"];

    res.statusCode = 200;
    // set http status vode
    // 200 -> req is successfully
    // 201, 400, 400, 429, 401

    res.setHeader("Content-Type", "text/plain");

    res.end(`Basic http node server: ${method}: ${url}: ${userAgent}`);
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