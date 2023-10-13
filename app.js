const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("./util/sequelize");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
  },
});

//import and middlewares
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://127.0.0.1:3000", credentials: true }));
app.use(bodyParser.json());

//import models and database
const User = require("./models/user-model");
const Resetpassword = require("./models/password-model");

//Model Relation
User.hasMany(Resetpassword);
Resetpassword.belongsTo(User);

//import routes
const userRouter = require("./routes/user");
const passwordRouter = require("./routes/password");

// app.get('/socket.io/socket.io.js', (req, res) => {
//     res.setHeader('Content-Type', 'application/javascript');
//     res.sendFile( path.join(__dirname,'node_modules/socket.io/socket.io.js'));
// });

//route directs
app.use("/", userRouter);
app.use("/password", passwordRouter);

//use static files
app.use(express.static(path.join(__dirname, "views")));
// app.use((req, res)=>{res.sendFile(path.join(__dirname,`/views/${req.url}`))})


sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.log("Database Error setting Sequelize", err);
  });
  const users = [];

  //initialize the socket aka connection event
  io.on("connection", (socket) => {
    //user join event & broadcast
    socket.on("user-joined", (user) => {
        console.log(socket, user);
      // users[socket.id] = user; //gives socket.id key and attches with user
      
      socket.broadcast.emit("user-joined", user);
    });
  
    //send-message event and recieve-message broadcast
    // socket.on("send-message", (message) => {
    //   const user = users[socket.id];
    //   socket.broadcast.emit("recieve-message", { user: user, message: message });
    // });
  
    //user-left event & broadcast it executes automatically when user log out or close the tab, inbuilt socket.io feature
    // socket.on("disconnect", () => {
    //   const user = users[socket.id];
    //   delete users[socket.id];
    //   socket.broadcast.emit("user-left", user);
    // });
  });
  