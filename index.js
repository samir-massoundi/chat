const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbname = "DBchat";
let db;

mongoClient.connect(url, function (err, client) {
  {
    if (err) {
      process.exit(1);
    } else {
      console.log("connecté à mongodb");
      db = client.db(dbname);
      let collection = db.collection('historique messages');
      app.get("/", (req, res) => {
        // res.send('<h1> Hello </h1>')
        res.sendFile(__dirname + "/index.html");
      });

      io.on("connection", (socket) => {
        console.log("un utilisateur est connecté");
        socket.on("chat message", (msg) => {
          console.log("message: " + msg);
          io.emit("chat message", msg);
          collection.insertOne({pseudo : 'Tears',message : msg})
        });
      });

      http.listen(3003, () => {
        console.log("listening on *:3003");
      });
    }
  }
});
