const User = require('../models/user');

exports.registerUser = async (req, res) => {
  const { firstName, lastName, levelOfStudy, phoneNumber } = req.body;
  try {
    const existingUser = await User.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }
    await User.register(firstName, lastName, levelOfStudy);
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};
