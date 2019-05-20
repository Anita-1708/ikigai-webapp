var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const routefile=require("./routes/routefile");



var app = express();
app.use(bodyParser.urlencoded({ extended: false })); //for req.body
app.use(express.static(path.resolve(__dirname, 'views')));
//if not mentioned, on opening localhost:3030 it wont open index html page automatically
//u will have to run index html file separately

app.set("view engine", "pug");
app.set("views", "./views");
app.use("/", routefile);



    

// app.get('/view-documents',  function(req, res) {
//     const db = client.db(dbName);
//     dbConn.then(function(db) {
//         db.collection('documents').find({}).toArray().then(function(docs) {
//             res.status(200).json(docs);
//         });
//     });
// });






app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');