
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

// Main Pages
var index = require('./routes/login');
var accomplishments = require('./routes/accomplishments');
var respects = require('./routes/respects');
var goals = require('./routes/goals');
var manage = require('./routes/manage');
var settings = require('./routes/settings');

// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// For POST
var goalsJSON = require('./goals.json');
var accompJSON = require('./accomplishments.json');

// Add routes here
// Main pages
// app.get('/', index.view);
app.get('/', function(req, res) {
	// accompJSON = {
	// 	"accomplishments": [
	// 		{
	// 			"id": "0",
	// 			"name": "Akshat Vasavada",
	// 			"goal_type": "LONG-TERM GOAL",
	// 			"goal": "Apply to 3 companies before Spring 2015",
	// 			"respectValue": "RESPECT"		
	// 		},
	// 		{
	// 			"id": "1",
	// 			"name": "Alex Stolzoff",
	// 			"goal_type": "Weekly Goal",
	// 			"goal": "Complete login page for COGS 120",
	// 			"respectValue": "RESPECT"
	// 		},
	// 		{
	// 			"id": "2",
	// 			"name": "Akshat Vasavada",
	// 			"goal_type": "Weekly Goal",
	// 			"goal": "Run for a minute.",
	// 			"respectValue": "RESPECT"
	// 		}
	// 	]
	// }

	// goalsJSON = {
	// 		"ltg": []
	// 	};

	console.log(goalsJSON);
	res.render("login");
});

app.get('/accomplishments', function(req, res) {
	res.render("accomplishments", accompJSON);
});

app.post("/accomplishments", function(req, res) {
	// console.log(req.body.id);
	for(var i = 0; i < accompJSON['accomplishments'].length; i++) {
		// console.log(accompJSON['accomplishments'][i]);
		if(accompJSON['accomplishments'][i]['id'] == req.body.id) {
			// console.log(accompJSON['accomplishments'][i].respectValue);
			if(accompJSON['accomplishments'][i]['respectValue'] == "RESPECT") {
				accompJSON['accomplishments'][i]['respectValue'] = "RESPECTED";
			}
			else {
				accompJSON['accomplishments'][i]['respectValue'] = "RESPECT";
			}
			// console.log(accompJSON);
			return;
		}
	}
});

app.get('/respects', respects.view);
app.post("/respectstream", function(req, res){
	var respectstreamJSON = require('./respectstream.json');
	console.log(req.body);
	if(req.body.respectstream !=null){
		respectstreamJSON[respectstream].push({
			"id": req.body.id,
			"name": req.body.name,
			"goal_type" : req.body.goal_type,
			"goal": req.body.goal,
			"respectgiven" : req.body.respectgiven

		})
	}
});

app.get('/goals', function(req, res) {
	var random_num = Math.random();

	if(random_num > 0.5){
	  res.render("goals", goalsJSON);
	}else{
	  res.render("goals_alternate", goalsJSON)
	}
});

app.post("/goals", function(req, res) {
	if (req.body.ltg != null) {
		console.log("id: " + req.body.id);
		goalsJSON['ltg'].push({
			"id": req.body.id,
			"goal": req.body.ltg,
			"wgs": []
		});
	}
	else if(req.body.wg != null) {
		// var wgIds = ["sdfjkl3isd", "dfjkl43ipo", "98043kjlds", "sf04b3jkla", "dsf8932kj3", "df89032jk0", "8903jkle24"];
		for(var i = 0; i < goalsJSON['ltg'].length; i++) {
			if(goalsJSON['ltg'][i]['id'] ==  req.body.id) {
				var wgId = goalsJSON['ltg'][i]['wgs'].length + 1;
				console.log("WGID: " + wgId);
				goalsJSON['ltg'][i]['wgs'].push({
					"id": req.body.id,
					"wid": wgId,
					"description": req.body.wg
				});
				console.log(goalsJSON);
				// Break out of loop
				break;
			}
		}
	}
	else if (req.body.deleteLTG != null) {
		console.log(goalsJSON['ltg']);
		console.log("id: " + req.body.id);
		// Find element index in array
		var index = -1;
		for(var i = 0; goalsJSON['ltg'].length; i++) {
			if(goalsJSON['ltg'][i].id == req.body.id) {
				// index = i;
				goalsJSON['ltg'].splice(i, 1);
				break;
			}
		}
		// Delete element from JSON array
		if(index != -1) {	// Error prevention (prevent accidental deletion of last element in array when indexOf element not found)
			// goalsJSON['ltg'].splice(index, 1);
		}
	}
	else if (req.body.deleteWG != null) {
		for(var i = 0; i < goalsJSON['ltg'].length; i++) {
			if(goalsJSON['ltg'][i]['id'] ==  req.body.id) {
				console.log(goalsJSON['ltg'][i]['wgs']);
				// Find element index in array
				// console.log("WID: " + req.body.wid);
				var index = -1;
				for(var j = 0; goalsJSON['ltg'][i]['wgs'].length; j++) {
					if(goalsJSON['ltg'][i]['wgs'][j].wid == req.body.wid) {
						// index = j;
						goalsJSON['ltg'][i]['wgs'].splice(j, 1);
						// break out of loop
						break;
					}
				}
				console.log(index);

				// Delete element from JSON array
				if(index != -1) {	// Error prevention (prevent accidental deletion of last element in array when indexOf element not found)
					// goalsJSON['ltg'][req.body.id]['wgs'].splice(index, 1);
				}
			}
		} 
	}
	else if (req.body.completeLTG != null) {
		for(var i = 0; i < goalsJSON['ltg'].length; i++) {
			// console.log("LTG: ");
			// console.log(goalsJSON['ltg'][i]);
			if(goalsJSON['ltg'][i]['id'] == req.body.id) {
				// console.log(goalsJSON['ltg'][i]['isComplete']);
				if(goalsJSON['ltg'][i]['isComplete'] == "true") {
					console.log("called!");
					return;
				}
				// for(var j = 0; goalsJSON['ltg'][i]['wgs'].length; j++) {
				// 	if(goalsJSON['ltg'][i]['wgs'][j]['isComplete'] != true) {
				// 		// end
				// 		return;
				// 	}
				// }
				// If all weekly goals are completed (or none exist)
				accompJSON['accomplishments'].push({
					"id": (accompJSON['accomplishments'].length + 1),
					"name": req.body.name,
					"goal_type": "LONG-TERM GOAL",
					"goal": req.body.goal,
					"respectValue": "RESPECT"
				});
				goalsJSON['ltg'][i]['isComplete'] = "true";
				// console.log(goalsJSON);
			}
		}
	}
	else if (req.body.completeWG != null) {
		for(var i = 0; i < goalsJSON['ltg'].length; i++) {
			if(goalsJSON['ltg'][i].id == req.body.id) {
				for(var j = 0; j < goalsJSON['ltg'][i]['wgs'].length; j++) {
					if(goalsJSON['ltg'][i]['wgs'][j]['wid'] == req.body.wid) {
						if(goalsJSON['ltg'][i]['wgs'][j]['isComplete'] == "true") {
							console.log("called!");
							return;
						}
						accompJSON['accomplishments'].push({
							"id": (accompJSON['accomplishments'].length + 1),
							"name": req.body.name,
							"goal_type": "Weekly Goal",
							"goal": req.body.description,
							"respectValue": "RESPECT"		
						});
						goalsJSON['ltg'][i]['wgs'][j]['isComplete'] = "true";
						return;
					}
				}
			}
		}
	}
});
app.get('/manage', manage.view);
app.get('/settings', settings.view);

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});