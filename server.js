const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const methodOverride = require('method-override');

const morgan = require('morgan');

const session = require('express-session');

const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const userController = require(`./controllers/users.js`);
const ingredientsController = require(`./controllers/ingredients.js`);
const recipeController = require(`./controllers/recipes.js`);
const path = require("path");

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on("error", (err) => {
  console.log(`Failed to connect due to ${err}.`);
});


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

app.use(passUserToView);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});
// Index	‘/users/:userId/foods’	GET
// New	‘/users/:userId/foods/new’	GET
// Create	‘/users/:userId/foods’	POST
// Show	‘/users/:userId/foods/:itemId’	GET
// Edit	‘/users/:userId/foods/:itemId/edit’	GET
// Update	‘/users/:userId/foods/:itemId’	PUT
// Delete	‘/users/:userId/foods/:itemId’	DELETE


app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);
app.use('/users', userController);
app.use('/ingredients', ingredientsController);
app.use('/recipes', recipeController);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});