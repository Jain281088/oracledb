var app = require('express')(); // Express App include
var http = require('http').Server(app); // http server
var oracledb = require('oracledb'); // oracledb include
var config = require('./dbConfig.js'); //oracle config
var async = require('async');
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var wait = require('waitfor');

console.log('1');

// var connection = oracledb.getConnection({ // oracledb Connection
    // user          : config.user,
    // password      : config.password,
    // connectString : config.connectString
  // }, 
  // function(err, connection){
    // if(err){
	  // throw err;
	// }
	// return connection;
  // });

console.log('2');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
console.log('3');

var iterateFn = function (rowData, cb){
	var fundData = {};
	
	fundData.id = rowData[0];
	fundData.name = rowData[1];
	fundData.job = rowData[2];
	fundData.managerId = rowData[3];
	fundData.hireDate = rowData[4];
	fundData.salary = rowData[5];
	fundData.commision = rowData[6];
	fundData.departmentId = rowData[7];
	
	
	console.log(fundData.id);
	
	return cb(null, fundData);
}

app.get('/get',function(req,res){
    var data = {
        "error":1,
        "Get":""
    };
 
    console.log('4');

    oracledb.getConnection({ // oracledb Connection
		user          : config.user,
		password      : config.password,
		connectString : config.connectString
	  },
	  function(err, connection){
		if(err){
			console.log('E1');
			throw err;
		}
		connection.execute("SELECT systimestamp from dual", function(err, result)
		{
			if(err){
				console.log('E2');
				throw err;
			}
			console.log('5');
			if(result.length != 0){
				console.log('6');
				data["error"] = 0;
				data["Date"] = result;
				res.json(data);
			}
			else{
				console.log('7');
				data["Date"] = 'No date Found..';
				res.json(data);
			}
		});
	});
});


app.post('/post',function(req,res){
	res.setHeader('Content-Type', 'application/json');
    
	//console.log(req.body);
	//console.log(req.body.name);
	
	var data = [];
 
    console.log('4');

    oracledb.getConnection({ // oracledb Connection
		user          : config.user,
		password      : config.password,
		connectString : config.connectString
	  },
	  function(err, connection){
		if(err){
			console.log('E1');
			throw err;
		}
		connection.execute("select empno, ename, job, mgr, hiredate, sal, comm, deptno from emp", function(err, result)
		{
			if(err){
				console.log('E2');
				throw err;
			}
			console.log('5');
			if(result.length != 0){
				console.log('6');
				
				async.each(result.rows, async function (row, cb){
													var fundData = {};
													
													fundData.id = row[0];
													fundData.name = row[1];
													fundData.job = row[2];
													fundData.managerId = row[3];
													fundData.hireDate = row[4];
													fundData.salary = row[5];
													fundData.commision = row[6];
													fundData.departmentId = row[7];
													
													console.log(row[0]);
													data.push(fundData);
												});
				res.json(data);
			}
			else{
				console.log('7');
				data["Date"] = 'No date Found..';
				res.json(data);
			}
		});
	});
});

app.listen(3000);
