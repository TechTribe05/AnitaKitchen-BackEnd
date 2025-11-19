const  express = require("express");
const  cartRouter  = require("./cart.router.js");
const app = express();

const PORT = 3001;

app.use(express.json());
app.get("/check", (req, res) =>{
    res.end("from cart  ☠!");
});

app.use("/cartservice", cartRouter);

app.listen(PORT,  () => {
    console.log(`Cart service is running on http://localhost:${PORT}`);
});