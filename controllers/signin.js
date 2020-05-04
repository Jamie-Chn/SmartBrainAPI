// handle with register activities

//const handleSignin = (req, res, db, bcrypt) => {
// the above function can be written as below, as funtion within a function
// 
const handleSignin = (db, bcrypt) => (req, res) => {
/*	// below is before connecting to db.
	//res.send('signing'); // use postman API call to check the response.
	//res.json('signing');

	// Load hash from your password DB.
	bcrypt.compare("apples", '$2a$10$s8Gf44AjBiLENwBLIkfs3ejFWXBtk67GCsRB27Vm7KRMetQO.Tlv6', function(err, res) {
		console.log('first guess', res);
		// res == true
	});
	bcrypt.compare("veggies", '$2a$10$s8Gf44AjBiLENwBLIkfs3ejFWXBtk67GCsRB27Vm7KRMetQO.Tlv6', function(err, res) {
		console.log('second guess', res);
	    // res = false
	});
	// users[0] - first element of the array
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json(database.users[0]); // return response databse first user.
		//res.json('success'); return response databse success
	} else {
		res.status(400).json('error logging in...');
	}*/
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission');
	}
	db.select('email', 'hash').from('login').where('email', '=', email)
		.then(data => {
			//console.log(data[0]);
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users').where('email', '=', email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('Unable to get user'))
			} else {
				res.status(400).json('Wrong Credentials')
			}
		})
		.catch(err => res.status(400).json('Wrong Credentials'))
}

module.exports = {
	handleSignin: handleSignin
}