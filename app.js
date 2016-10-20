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
var skypeUserName = typeof process.argv[2] !== 'undefined' ? process.argv[2] : '';
var skypeDbPath = path.join('C:', 'Users', computerUserName, 'AppData', 'Roaming', 'skype', skypeUserName, 'main.db');
var keyword = typeof process.argv[3] !== 'undefined' ? process.argv[3] : '#pcmkfood';

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
  var query = "SELECT from_dispname, body_xml, timestamp__ms FROM Messages WHERE timestamp__ms > " + startOfDay + " AND body_xml LIKE '%" + keyword + "%'";
  console.log('Executing query...');
  var res = db.exec(query);
  if(res.length){
    var results = res[0].values;
    console.log('================================================');
    for(var i = 0, item; item = results[i]; i++){
      console.log(i + 1 + '.' + item[0] + ' ' + item[1].replace(keyword, '') + '|');
    }
    console.log('================================================');
    console.log('Number of results: ' + results.length);
    console.log('================================================');
  } else {
    console.log('No results...');
  }
  db.close();
}