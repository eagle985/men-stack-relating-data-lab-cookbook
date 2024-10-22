const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
    const userInDatabase = await User.findById(req.session.user._id)

    res.render('foods/index.ejs', {
        pantry: userInDatabase.pantry
    })
});

router.get('/new', (req, res) => {
    res.render('foods/new.ejs')
});



router.post('/', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.user._id, {
            $push: {
                pantry: req.body
            }
        })
        res.redirect(`/users/${req.session.user._id}/foods`)
    } catch (error) {
        console.log("Error Adding Food to Pantry", error)
        res.redirect("/");
    }

})

router.get('/:itemId', async (req, res) => {
    const userInDataBase = await User.findById(req.session.user._id)
    const foodItem = userInDataBase.pantry.find(food => {
        return food._id.toString() === req.params.itemId
    })
    res.render('foods/show.ejs', {
        food: foodItem
    })
});

router.get('/:itemId/edit', async (req, res) => {
    const userInDataBase = await User.findById(req.session.user._id)
    const foodItem = userInDataBase.pantry.find(food => {
        return food._id.toString() === req.params.itemId
    })
    res.render('foods/edit.ejs', {
        food: foodItem
    })
});


router.put("/:itemId", async (req, res) => {
    try {
        const responseFromDB = await User.updateOne({ "pantry._id": req.params.itemId }, {
            $set: {
                "pantry.$.name": req.body.name
            }
        }
        )
        //console.log(responseFromDB)
        res.redirect(`/users/${req.session.user._id}/foods`)
        
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.delete("/:itemId", async (req, res) => {
    try {
        const responseFromDB = await User.findByIdAndUpdate(req.session.user._id, {
            $pull: {
                pantry: { _id: req.params.itemId }
            }
        })
        //console.log(responseFromDB)
        res.redirect(`/users/${req.session.user._id}/foods`)
    } catch (error) {
        console.log(error)
        res.redirect('/');
    }
})

module.exports = router;
