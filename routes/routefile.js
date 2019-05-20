const express=require('express');
const app=express();
const router=express.Router();
const MongoClient = require('mongodb').MongoClient;
const _=require('underscore');


const assert = require('assert');

var youloveArray, paidforArray, goodatArray, worldneedsArray, passion, mission, profession, vocation, purpose;


var url='mongodb://localhost:27017';
const dbName = 'myproject';


router.post('/post-answers', function (req, res) {
    /*dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('documents').insertOne(req.body);
    });    */

    var ikigaiObj=findYourIkigai(req);
      console.log(ikigaiObj);
     
    MongoClient.connect(url, {useNewUrlParser:true},function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        
        //delete req.body._id;
        const obj={datab:db, body:ikigaiObj}
        insertDocuments(obj, function(){
         // assert.equal(3, result.result.n);
         // assert.equal(3, result.ops.length);
          //console.log("Inserted 3 documents into the collection");
          
        client.close();
        });
        
      });
      

      for(x in ikigaiObj){
        if(ikigaiObj[x].length==0){
          console.log("undefined");
          ikigaiObj[x]=["not obvious by the values entered."];
        }
        else
        {
          ikigaiObj[x]=[ikigaiObj[x].toString().replace(/[\[\]"]/g, "")];
        }
      }
      console.log(ikigaiObj);
   // res.send('Data received:\n' + JSON.stringify(req.body));
   //if you wont write render or send, the page will continue loading on button click and wont be redirected to anywhere neither the databse got the new values
   res.render("viewpurpose.pug", {title:"Your Ikigai", 
                                  purp:"Your reason for being is "+ikigaiObj.purpose[0], 
                                  pass:"Your passion to succeed in life is "+ikigaiObj.passion[0], 
                                  miss:"Your mission on Earth is "+ikigaiObj.mission[0], 
                                  prof:"Profession to move forward is "+ikigaiObj.profession[0], 
                                  voc:"Vocation for you is "+ikigaiObj.vocation[0]});
});

const insertDocuments = function(obj, callback) {

    const db=obj.datab;
    const body=obj.body;
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertOne(
      body
    , function(err, result) {
      assert.equal(err, null);
      return callback(result);
});
}

//WORKING--------------WITHOUT CALLBACKS
/*app.get('/view-documents',  function(req, res) {
    MongoClient.connect(url, {useNewUrlParser:true},function(err, client) {
     // Get the documents collection
     const db = client.db(dbName);
     const collection = db.collection('documents');
     // Find some documents
     collection.find({}).toArray(function(err, docs) {
       assert.equal(err, null);
       console.log("Found the following records");
       res.status(200).json(docs);
       
     });
            
        });
    });*/


//WORKING--------------WITH CALLBACKS
router.get('/view-documents',  function(req, res) {
    MongoClient.connect(url, {useNewUrlParser:true},function(err, client) {
     // Get the documents collection
     const db = client.db(dbName);
     findDocuments(db, function(docs){
        res.status(200).json(docs);
       client.close();
       });
       
       
     });
            
        });
    

    const findDocuments = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('documents');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          console.log("Found the following records");
          console.log(docs)
          callback(docs);
        });
      }

function findYourIkigai(req){
  youloveArray=req.body.tempyoulove.split(",");
  youloveArray.shift();
  goodatArray=req.body.tempgoodat.split(",");
  goodatArray.shift();
  paidforArray=req.body.temppaidfor.split(",");
  paidforArray.shift();
  worldneedsArray=req.body.tempworldneeds.split(",");
  worldneedsArray.shift();
  passion=youloveArray.filter((val)=>{return _.contains(goodatArray, val)});
  mission=youloveArray.filter((val)=>{return _.contains(worldneedsArray, val)});
  profession=goodatArray.filter((val)=>{return _.contains(paidforArray, val)});
  vocation=worldneedsArray.filter((val)=>{return _.contains(paidforArray, val)});
  purpose=findpurpose(passion, mission, profession, vocation);
  passion=_.reject(passion,(val)=>{return _.contains(purpose,val)});
  mission=_.reject(mission, (val)=>{return _.contains(purpose, val)});
  profession=_.reject(profession, (val)=>{return _.contains(purpose, val)});
  vocation=_.reject(vocation, (val)=>{return _.contains(purpose, val)});
  var ikigaiobj={"name":req.body.name,"youlove":youloveArray, "goodat":goodatArray, "paidfor":paidforArray, "worldneeds":worldneedsArray, "passion":passion, "mission":mission, "vocation":vocation, "profession":profession, "purpose":purpose};

  return ikigaiobj;
}

function findpurpose(passion, mission, profession, vocation){
  if(passion.length==0 || mission.length==0 || profession.length==0 || vocation.length==0)
 {
  purpose=[];
  
 } 
  else
  {
    purpose=passion
    .filter((val1)=>{return _.contains(mission, val1)})
    .filter((val2)=>{return _.contains(profession, val2)})
    .filter((val3)=>{return _.contains(vocation, val3)});
  }
  return purpose;
}

module.exports=router;