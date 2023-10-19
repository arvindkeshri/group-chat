const express = require("express");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./util/sequelize");
const server = require("http").createServer(app);
const io = require("socket.io")(server) 


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//import models and database
const User = require("./models/user");
const Resetpassword = require("./models/password");
const Message = require('./models/message');
const Group = require('./models/group');
const Usergroup = require('./models/usergroup');


//Model Relation
User.hasMany(Resetpassword);
Resetpassword.belongsTo(User,  {constraints: true, onDelete: 'CASCADE'});

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);     //can be skipped
Group.belongsTo(User,  {constraints: true, onDelete: 'CASCADE'});

// Usergroup.belongsTo(User);
// Usergroup.belongsTo(Group);
Group.belongsToMany(User, {through: Usergroup});
User.belongsToMany(Group, {through: Usergroup});

Group.hasMany(Message);
Message.belongsTo(Group, {constraints: true, onDelete: 'CASCADE'});




//import routes
const userRouter = require("./routes/user");
const passwordRouter = require("./routes/password");
const messageRouter = require('./routes/message');
const groupRouter = require('./routes/group');


//route directs
app.use("/", userRouter);
app.use("/", messageRouter);
app.use("/password", passwordRouter);
app.use('/group', groupRouter);

//use static files
app.use(express.static(path.join(__dirname, "views")));

sequelize
  .sync()
  .then((result) => {
    server.listen(3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.log("Database Error setting Sequelize", err);
  });

  //initialize the socket aka connection event and give socket.id key to user
  const users = [];
  io.on("connection", (socket) => {
    socket.on("user-joined", (usertoken) => {
      const user = jwt.decode(usertoken);
      users[socket.id] = user;                                      
      socket.broadcast.emit("user-joined-broadcast", user);
  
    });
  
    // send-message event and recieve-message broadcast
    socket.on("send-message", (message) => {
      const user = jwt.decode(message.token);
      const userb = users[socket.id];
      const data =  { user: user.name, message: message.message }
      socket.broadcast.emit("receive-message", data);
    });
  
// user-left event & broadcast it executes automatically when user log out or close the tab, inbuilt socket.io feature
    socket.on("disconnect", () => {
      const user = users[socket.id];
      delete users[socket.id];
      socket.broadcast.emit("user-left", user.name);
    });
  });
  






































  // app.use((req, res)=>{res.sendFile(path.join(__dirname,`/views/${req.url}`))})