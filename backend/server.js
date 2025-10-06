const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "todo.db");
let db;
const PORT = 5000;

const initializer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () => {
      console.log("server is running at http://localhost:5000");
    });
  } catch (e) {
    console.log(e.message);
  }
};

initializer();

app.get("/todos", async (req, res) => {
  const getQuery = `
        SELECT * from todo
    `;
  const responseGot = await db.all(getQuery);
  res.send(responseGot);
});

app.post("/todos/save", async (req, res) => {
  const { data } = req.body;

  for (let obj of data) {
    const { id, name, status } = obj;
    const postQuery = `
        INSERT INTO todo (id , name , status)
        VALUES ("${id}" , "${name}" , "${status}")
    `;
    

    
    await db.run(postQuery);
    
  }
  res.send({ message: "All todos saved successfully" });
});

app.delete("/todos/delete", async (req, res) => {
  const deleteQuery = `
    DELETE FROM todo;
  `;
  const deleteResponse = await db.run(deleteQuery);
  res.send({ message: "All todos Deleted" });
});

