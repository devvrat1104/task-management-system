const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;

        const user = new User({ name, email, password });
        console.log(user)
        await user.save();
        res.status(201).send({ user, message: "User Created Successfully" });
    } catch (err) {
        res.status(400).send({ error: err });
    }

}

async function loginUser(req, res) {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user + "------------------------------" + user.password)
        if (!user) {
            console.log('Unable to login , invalid credentials')
            throw new Error('Unable to login , invalid credentials');
        }

        // console.log(password + "----" + user.password)

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Unable to login , invalid credentials');
        }

        const token = jwt.sign({
            _id: user._id.toString()
        }, process.env.JWT_SECRET_KEY);

        return res.send({ user, token, message: "Logged in successfully" });
    } catch (err) {
        res.status(400).send({ error: err });
    }
}

module.exports = { createUser, loginUser }