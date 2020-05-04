// handle with upload image activities

const Clarifai = require('clarifai');

// use your own API key here from Clarifai
const app = new Clarifai.App({
  apiKey: 'b3038c8160a14454b186ea4d6387ffd7'
});

const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
/*below code is before connecting to the database
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
			console.log('image res ', res.json())
		}
	})
	if (!found) {
		res.status(400).json('Image Not found.')
	}
})

bcrypt.hash("bacon", null, null, function(err, hash) {
     Store hash in your password DB*/
	
	db('users')
	.where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		//console.log("entries -> ", entries[0]);
		//console.log(req.body);
		res.json(entries[0])
	})
	.catch(err => res.status(400).json('Unable to set entries'))
 }

 module.exports = {
 	handleImage,
 	handleApiCall
 }