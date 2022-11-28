import bcrypt from 'bcrypt';
import pkg from 'jsonwebtoken';
const { Jwt } = pkg;
import User from '../models/User.js';

//// Register User 

export const register = async(req,res) => {
  try {
    const {
      firstName,
      lastName,
      location,
      email,
      password,
      picturePath,
      friends,
      occupation
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password,salt);

    const newUser = new User ({
      firstName,
      lastName,
      location,
      email,
      password: passwordHash,
      picturePath,
      friends,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impresstions: Math.floor(Math.random() * 1000)
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }
  catch (err) {
    res.status(500).json({ error: err.message});
  }
}

//login user

export const login = async (req, res) => {
  try {
    // get data from user (frontend)
    const { email, password } = req.body;

    //find user in the DB using findOne method
    const user = await User.findOne({email: email});

    // Send an error message if user does not exist
    if(!user) return res.status(400).json({msg: "User does not exist."})

    // Compare the password if user email exist in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    // Send an error message if User password is incorrect
    if(!isMatch) return res.status(400).json({ msg: 'Invalid email or password'});

    // Make a JWT token 
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRETS);

    // prevent user password before sending it to frontend we donot want to send our password to frontend
    delete user.password;

    // Finally send the data to frontend
    res.status(200).json({ token, user });
  } catch (err){
    res.status(500).json({error: err.message});
  }
}