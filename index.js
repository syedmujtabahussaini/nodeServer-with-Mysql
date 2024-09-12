const express = require("express");
const mysql = require("mysql2");
const methodOverRide = require("method-override");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(methodOverRide("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "demo",
  password: "$Pk1001#",
});

app.get("/", (req, res) => {
  res.send("This is Home Page");
});

app.get("/users", (req, res) => {
  try {
    connection.query("select * from user order by username", (err, users) => {
      if (err) throw err;
      res.render("users", { users });
    });
  } catch (err) {
    console.log("error", err);
    res.send(err);
  }
});

app.get("/users/detail/:id", (req, res) => {
  const { id } = req.params;
  try {
    connection.query(`select * from user where id = '${id}'`, (err, user) => {
      if (err) throw err;
      const result = user[0];
      res.render("user", { result });
    });
  } catch (error) {
    console.log("error", err);
    res.send(err);
  }
});

app.get("/users/edit/:id", (req, res) => {
  const { id } = req.params;
  try {
    connection.query(`select * from user where id = '${id}'`, (err, edit) => {
      if (err) throw err;
      const result = edit[0];
      res.render("userEdit", { result });
    });
  } catch (error) {
    console.log("error", error);
    res.send(error);
  }
});

app.patch("/users/edit/:id", (req, res) => {
  const { username, email } = req.body;
  const { id } = req.params;
  try {
    connection.query(
      `update user set username='${username}' where id = '${id}' `,
      (error, result) => {
        if (error) throw error;
        console.log("record updated");
        res.redirect("/users");
      }
    );
  } catch (error) {
    console.log("error", error);
    res.send(error);
  }
});

app.get("/users/delete/:id", (req, res) => {
  const { id } = req.params;
  try {
    connection.query(`delete from user where id ='${id}' `, (error, result) => {
      if (error) throw error;
      console.log("record deleted");
      res.redirect("/users");
    });
  } catch (error) {
    console.log("error", error);
    res.send(error);
  }
});

app.get("/users/addnew", (req, res) => {
  res.render("addnew");
});

app.post("/users/addnew", (req, res) => {
  const { username, email, password } = req.body;
  const id = uuidv4();
  try {
    connection.query(
      `insert into user(id,username,email,password) values ('${id}','${username}','${email}','${password}')`,
      (error, result) => {
        if (error) throw error;
        console.log("record has been added");
        res.redirect("/users");
      }
    );
  } catch (error) {
    console.log("error", error);
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is Running Port ${PORT}`);
});
