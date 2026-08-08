import http, { IncomingMessage, ServerResponse } from "node:http";

const HOSTNAME = "localhost";
const PORT = 5000;

type CreateUserBody = { name?: string; email?: string; };

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => 
{
    
    const method = req.method ?? "GET";
    
    const requestUrl = new URL(req.url ?? "/", `http:${req.headers.host}`);
    
    const pathName = requestUrl.pathname;
    
    res.setHeader("Content-Type", "text/plain");

    if (method === "POST" && pathName === "/users") 
    {
        const chunks: Buffer[] = [];

        //Chunk 1 → {
        //Chunk 2 → "name": "Anubhav",
        //Chunk 3 → ,"email":
        //Chunk 4 → "anubhav@gmail.com"
        //Chunk 5 → }

        // data event is going to run every time node receives a new body chunk
        req.on("data", (chunk: Buffer) => 
        {
            chunks.push(chunk);
        });

        //This triggers when Node.js has received the complete body of the request.
        req.on("end", () => 
        {
            try 
            {
                const rawBody = Buffer.concat(chunks).toString("utf-8");

                if (!rawBody) 
                {
                    res.statusCode = 400;
                    res.end("req body is required");
                    return;
                }

                const body = JSON.parse(rawBody) as CreateUserBody;

                if (!body.name || !body.email) 
                {
                    res.statusCode = 400;
                    res.end("both name and email is required");
                    return;
                }

                res.statusCode = 201;
                res.end(`User created ${body.name} and ${body.email}`);
            } 
            catch 
            {
                res.statusCode = 400;
                res.end("invalid json body");
            }
        });


        //This triggers when an error occurs while reading the request stream.
        /*
        Example situations

        Theoretically, an error in the request stream can occur in cases like:

            The client unexpectedly terminates the connection.

            An error occurs in the underlying socket/connection.

            A network-level issue arises while reading the request stream.

            The stream itself enters an error state.

            Important: The client sent invalid JSON*/
            
        req.on("error", () => 
        {
            res.statusCode = 500;
            res.end("failed to read request body");
        });

        return;
    }

    res.statusCode = 404;
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