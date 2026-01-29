const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

//REF-A9X2QZ

dotenv.config();

const studentRouter = require('./src/routes/studentsRouter');
const { studentModel, initDb, userModel, parentTestModel, stuTestModel,examModel, teacherModel, Payment,TeacherReferral } = require('./src/models');

const authRouter = require('./src/routes/authRouter');
const parentTesti = require('./src/routes/parentTestRouter');
const studentTestRouter = require('./src/routes/studentTestRouter');
const examRouter = require('./src/routes/examRouter');
const teacherRouter = require('./src/routes/teacher.routes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const referralRoutes = require("./src/routes/referral.routes");


const app = express();

app.use(express.json());
app.use(cors());

// attach models to req
app.use((req, res, next) => {
  req.studentModel = studentModel;
  req.userModel = userModel;
  req.parentTestModel = parentTestModel;
  req.stuTestModel = stuTestModel;
  req.examModel = examModel;
  req.teacherModel = teacherModel;
  req.Payment = Payment;
  req.teacherReferralModel =TeacherReferral;
  next();
});

app.use('/api/v1', studentRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1', parentTesti);
app.use('/api/v1', studentTestRouter);
app.use('/api/v1', examRouter);
app.use('/api/v1', teacherRouter);
app.use('/api/v1', paymentRoutes);
app.use("/api/v1/referrals", referralRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

initDb().catch((err) => {
  console.error('❌ DB init failed:', err);
  server.close(() => process.exit(1));
});
