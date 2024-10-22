const express = require('express');
const router = express.Router();

const Ingredient = require('../models/ingredient.js');

router.get('/', async (req, res) => {
    const ingredients = await Ingredient.find()
    res.render('ingredients/index.ejs', {
        ingredients
    })
});

router.post('/', async (req, res) => {
    try {
      await Ingredient.create(req.body);
  
      res.redirect('/ingredients');
    
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

  module.exports=router