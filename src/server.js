const app = require("./app");
const http = require("http");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

server.on("listening", () => {
  console.log(`server is listening for requests on port ${server.address().port}`);
});

// prevent app from sleeping in production
// setInterval(() => {
//   http.get("http://collapedia.herokuapp.com");
// }, 300000); // pings app every 5 minutes (300000)
