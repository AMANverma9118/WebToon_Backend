const express = require('express');
const router = express.Router();
const User = require('../Schema/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route 1: Create a user (POST /api/user/Createuser)
router.post('/Createuser', [
  body('name', 'Enter Valid name').isLength({ min: 3 }),
  body('email', 'Enter valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
 
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
   
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry, a user already exists with this email" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, salt);

   
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: securePassword,
    });

    
    await user.save();

    
    const data = {
      user: {
        id: user.id
      }
    };

    
    const authToken = jwt.sign(data, process.env.JWT_SECRETE, { expiresIn: '1h' });

    
    res.json({ authToken: authToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

// Route number 2 :It login a user with the api api/user/Login
router.post('/Login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password can not be blank').exists(),
  ], async (req, res) => {
  
  
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
  
  
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
  
      const authToken = jwt.sign(data, process.env.JWT_SECRETE);
      res.json({ authToken })
  
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

module.exports = router;
