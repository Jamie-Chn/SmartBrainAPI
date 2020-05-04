// handle with register activities

const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('Incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => { // do more than 2 things at once and use trx obj to do the operation
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
				})
			})
			.then(trx.commit) // if success then commit
			.catch(trx.rollback) // if fail then rollback
		})
	// bcrypt.compareSync("bacon", hash); // true
	// bcrypt.compareSync("veggies", hash); // false

/*	bcrypt.hash(password, null, null, function(err, hash) {
	    // Store hash in your password DB.
	    // console.log(hash);
	});*/

	// database insert by using knex
	.catch(err => res.status(400).json('unable to register'))
	// below comment out is before connection to the database
	// database.users.push({
	// 	id: '103',
	// 	name: name,
	// 	email: email,
	// 	entries: 0,
	// 	joined: new Date()
	// })
	//
	// response back
	//res.json(database.users[database.users.length-1]);
}

module.exports = {
	handleRegister: handleRegister
}