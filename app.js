
/**
 * Module dependencies.
 */

var express = require('express');

var sys=require('sys');

var app = module.exports = express.createServer();

var db = require('./model.js');


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var dow = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
// Routes

function gen_random(callback){
    var items = [];
    var indexes = [];
    db.retrieveDB(function(d){
	if(d.length < 1)
	{
	    items = {dow:'No Data',lunch:'No Data',dinner:'No Data'};
	    callback(items);
	    return;
	}
	for(i=0 ; i < dow.length ;i++){
	    var k = Math.floor(Math.random()*d.length);
	    var lunch = d[k]._id;
	    k = Math.floor(Math.random()*d.length);
	    var dinner = d[k]._id;
	    items.push({dow:dow[i],lunch:lunch,dinner:dinner});
	    
	    }
	callback(items);
    });
}

app.get('/', function(req, res){
    gen_random(function(items) {
	res.render('index', {
	    title: 'CookWeek',
	    items:items
	});
    });
});

app.post('/',function(req,res){
    var recipeName = req.body.recipe.name;
    if(recipeName){
	db.intoDB(recipeName);
    }
    res.redirect('/');
});

app.get('/recipes',function(req,res){
    db.retrieveDB(function(d){ 
	res.render('recipes',{
	    title: "Added Recipes",
	    rcps : d
	});
    });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
