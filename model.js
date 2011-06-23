var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1",27017,{});

exports.intoDB = function(recipeName){
    new mongodb.Db('test',server,{}).open(function(error,client){
	if(error) throw error;
	var collection = new mongodb.Collection(client,'test_collection');
	console.log("Inserting %s",recipeName);
	collection.insert({_id:recipeName},{safe:true}),
			  function(err,objects){
			      if(err) console.warn(err.message);
			      if(err && err.message.indexOf('E11000')!== -1){
				  console.log("_id:%s already in database",recipeName);
			      }
			  }
    });
}

exports.retrieveDB=function (docs_callback){
    var self = this;
    new mongodb.Db('test',server,{}).open(function(error,client){
	var collection = new mongodb.Collection(client,'test_collection');
	collection.find({},{},function(err,cur){
	    cur.toArray(function(err,docs){
		console.log("Calling callback with results");
		docs_callback(docs);
	    });
	});
    });
}

