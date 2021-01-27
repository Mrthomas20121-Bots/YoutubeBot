const mysql = require('mysql');
var con = mysql.createConnection({
	host: 'mysql.hostinger.fr',
	user: 'u675366216_thomas',
	password: 'JqZYycSMElJ9',
	database: 'u675366216_vand'
});

con.connect(function(err) {
	if(err) throw err;
	con.query('select p.* from punishments p INNER JOIN users u on p.userid = u.id WHERE user = user AND type = \'warn\';', function (err, result, fields) {
		if (err) throw err;
		console.log(result);
	});
	con.end(function(err) {
		//console.log(err);
	})
});