const User = require('../models/User');
const utils = require('../lib/utils');
const passport = require('passport');
const authMiddleware = passport.authenticate('jwt', { session: false });

exports.auth = async(  req, res ) =>{
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
}

exports.getUsers = async(req, res) =>{
    try{
        const users = await User.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1, 
                    streetAddress: '$street_address',
                    createdAt: 1,
                    updatedAt: 1,
                    
                }
            }
        ])
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
    
     
}

exports.registerUser = async(req, res) =>{
    try {

        if(!req.body.password || !req.body.name || !req.body.email || !req.body.streetAddress){
            return res.status(402).send("name, password, streetAdress and email are all mandatory fields");
        }
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const streetAddress = req.body.streetAddress;

        const saltHash = utils.genPassword(password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = new User({
            name: name,
            hash: hash,
            salt: salt,
            email: email,
            street_address: streetAddress
        });

        await newUser.save()
        res.status(200).send({
            name: newUser.name,
            email: newUser.email,
            streetAddress: newUser.street_address

        });

    } 
    catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
}

exports.loginUser = async(req, res) =>{
    try{

        if(!req.body.password || !req.body.name){
            res.status(402).send("name and password both fields are needed");
        }
        const name = req.body.name;
        const password = req.body.password;
        const user = await User.findOne({ name: name });

        if (!user) {
            return res.status(401).send({ success: false, msg: "could not find user" });
        }
       // console.debug(user);
        const isValid = utils.validPassword(password, user.hash, user.salt);
        //console.debug(isValid)
        if (isValid) {
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
        }
        else {
            res.status(401).json({ success: false, msg: "you entered the wrong password" });
        }   
    }
    catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
}






