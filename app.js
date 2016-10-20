/*
 * Skype food order script
 */

var express = require('express');
var fs = require('fs');
var path = require('path');
var SQL = require('sql.js');

var app = express();
var port = process.env.PORT || 1337;

// START THE APP
// ==============================================
app.listen(port);
console.log('Executing script...');

var computerUserName = process.env['USERPROFILE'].split(path.sep)[2];

var skypeUserName = '';
if(typeof process.argv[2] === 'undefined'){
  console.log('Enter skype username and start the script again');
} else {
  skypeUserName = process.argv[2];
}

var skypeDbPath = path.join('C:', 'Users', computerUserName, 'AppData', 'Roaming', 'skype', skypeUserName, 'main.db');

fs.stat(skypeDbPath, function(err, stat){
  if(err == null) {
        console.log('Valid Skype user...');
        getOrders(skypeDbPath);
    } else if(err.code == 'ENOENT') {
        console.log('Invalid Skype user!');
    } else {
        console.log('Unknown error: ', err.code);
    }
    process.exit();
});

function getOrders(skypeDbPath){
  var filebuffer = fs.readFileSync(skypeDbPath);
  var db = new SQL.Database(filebuffer);
  var startOfDay = new Date().setHours(0,0,0,0);
  var query = "SELECT from_dispname, body_xml, timestamp__ms FROM Messages WHERE timestamp__ms > " + startOfDay + " AND body_xml LIKE '%asdasdasdasd%'";
  console.log('Executing query...');
  var res = db.exec(query);
  if(res.length){
    var results = res[0].values;
    console.log('================================================');
    for(var i = 0, order; order = results[i]; i++){
      console.log(order[0] + ' ' + order[1]);
    }
    console.log('================================================');
    console.log('Participants: ' + results.length);
    console.log('================================================');
  } else {
    console.log('No results...');
  }
  db.close();
}