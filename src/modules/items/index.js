const  express = require("express");
const  itemRouter = require("./item.router");
const app = express();

const PORT = 3002;

app.use(express.json());
app.get("/check", (req, res) =>{
    res.end("from item ☠!");
});

app.use("/itemservice", itemRouter);


app.listen(PORT,  () => {
    console.log(`Item service is running on http://localhost:${PORT}`);
});