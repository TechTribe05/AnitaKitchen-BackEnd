require("dotenv").config(); // ✅ MUST be first
const  express = require("express");
const  {createProxyMiddleware} = require("http-proxy-middleware");
// const connectDB = require("../../../database/dbConnection");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api/v1/cart", createProxyMiddleware ({
    target: "http://localhost:3001", 
    changeOrigin: true,
})
);

app.use("/api/v1/item", createProxyMiddleware ({
    target: "http://localhost:3002", 
    changeOrigin: true,
})
);


app.listen(PORT,  () => {
    console.log(`Msgate service is running on http://localhost:${PORT}`);
});