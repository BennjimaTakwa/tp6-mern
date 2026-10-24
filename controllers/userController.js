const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Article = require('../models/articleModel');

// JWT generation helper (valid for 1 day)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

const registerUser = async (req, res) => {
  try {
    // role is deliberately ignored: public sign-up can never create an admin
    const { name, email, password, age, bio, phone } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        message: 'Email already in use'
      });
    }

    // Secure hashing with a salt (salt factor = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, age, role: 'user', bio, phone
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

// 2. POST /api/users/login (sign in)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Constant-time password comparison
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. GET /api/users/profile (protected profile)
const getUserProfile = async (req, res) => {
  try {
    // req.user is injected by the protect middleware
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. GET /api/users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Retrieve user by ID

    
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({ message: err.message });
  }
};


// 6. Delete a user securely
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check whether the user has a published article
    const article = await Article.findOne({
      author: req.params.id,
      status: 'published'
    });

    if (article) {
      return res.status(400).json({
        message: 'Impossible to delete an author with published articles'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'User deleted'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. PUT /api/users/update-password (protected)
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: 'oldPassword and newPassword are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    // req.user comes without the password: reload it with the stored hash
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Ancien mot de passe incorrect'
      });
    }

    // New salt + hash for the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      message: 'Mot de passe mis a jour avec succes'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8. PUT /api/users/:id/role (admin only): promote a user to admin
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({
      message: 'User promoted to admin',
      user
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({ message: err.message });
  }
};

module.exports = {registerUser,loginUser,getUserProfile,getAllUsers,
  getUserById,
  deleteUser,
  updatePassword,
  updateUserRole
};
