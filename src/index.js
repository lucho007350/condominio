const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("index of post");
})

app.get("/posts", (req, res) => {
    res.send("ruta get");
})

app.post("/posts", (req, res) => {
    res.send("Update post");
})

app.put("/posts", (req, res) => {
    res.send("update post");
})

app.delete("/posts", (req, res) => {
    res.send(`delete post${PORT}`);
})

app.listen(PORT, () => {
  console.log(`corriendo en el puerto ${PORT}`);
});
