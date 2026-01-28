const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel')
// const teacherModel = require('../models/teacher.model')
const {sequelize} = require('sequelize')

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

    // 1. Find user
    const user = await req.userModel.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).send({
        status: false,
        message: "Invalid credentials",
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        status: false,
        message: "Invalid credentials",
      });
    }

    // 3. Get teacherId ONLY if role = teacher
    // let teacherId = null;

    // if (user.role === "teacher") {
    //   const teacher = await teacherModel.findOne({
    //     where: { email }, 
    //   });

    //   if (teacher) {
    //     teacherId = teacher.id;
    //   }
    // }

    // 4. Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Response
    res.status(200).send({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
        
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: false,
      message: "Login failed",
    });
  }
}

