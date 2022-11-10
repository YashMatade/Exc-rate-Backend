var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Currency = require("../models/Currency");

router.put('/submit', async (req, res) => {
    var body = req.body;
    let currency = new Currency();
    let users = await User.find({ email: body.email });   
    let user = new User();
    if(users.length != 0)
        user = await User.findById(users[0]._id);
    user.name = body.name;
    user.email = body.email;
    user.timestamp = new Date();
    
    user.save().then((result) => {
        res.end(JSON.stringify({ status: "success", data: result }));
    }, (error) => {
        res.end(JSON.stringify({ status: "failed", data: error }));
    });
});



router.get('/get', async (req, res) => {    
    let result = await Currency.find().sort({price:-1});
    res.end(JSON.stringify({ status: "success", data: result }));    
});



module.exports = router;