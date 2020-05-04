const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//need knex to connect to the database
const db = knex({
	client: 'pg',
	connection: {
	host : '127.0.0.1', // localhost
	user : 'postgres', // db owner
	password : 'test',
	database : 'smart_brain'
  	}
});

//console.log(postgres.select('*').from('users'));
// db.select('*').from('users').then(data => {
// 	console.log(data);
// })

const app = express();

app.use(bodyParser.json());
app.use(cors());

// below databse is used before connecting to DB
// const database = {
// 	users: [
// 		{
// 			id: '101',
// 			name: 'Jon',
// 			email: 'jon@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '102',
// 			name: 'Oliver',
// 			email: 'oliver.cheng@gmail.com',
// 			password: 'banana',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	],
// 	login: [
// 		{
// 			id: '123',
// 			hash: '',
// 			email: 'chloe.cheng@gmail.com'
// 		}
// 	]
// }

app.get('/', (req, res) => {res.send(database.users)})

// dependency injection into handleSignin function and set signin on the top
//app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

// the above signin can be written as below, as signin.handleSignin gets called
// It runs function handleSignin with (db, bcrypt) and called (req, res) as well 
app.post('/signin', signin.handleSignin(db, bcrypt))

// dependency injection into handleRegister function and set register on the top
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
	
// dependency injection into handleProfileGet function and set profile on the top
// profile page for each user, and can be used later
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

// dependency injection into handleImage function and set image on the top
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
//add new end point for post call
app.post('/imageUrl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
	//console.log(database.users[0].email);
})

/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
