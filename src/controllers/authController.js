const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel')

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await req.userModel.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).send({
      status: true,
      message: 'User registered successfully',
    
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({
        status: false,
        message: 'User already exists',
      });
    }

    res.status(500).send({
      status: false,
      message: 'Failed to register',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await req.userModel.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).send({
        status: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({
        status: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).send({
      status: true,
      token,
       user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: 'Login failed',
    });
  }
};
