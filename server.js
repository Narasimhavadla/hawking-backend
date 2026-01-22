const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const studentRouter = require('./src/routes/studentsRouter');
const { studentModel, initDb,userModel,parentTestModel,stuTestModel,examModel } = require('./src/models');
// const pdfRouter = require('./src/routes/pdfRouter');
const pdfRouter = require('./src/routes/pdfRouter')
const authRouter = require('./src/routes/authRouter')
const parentTesti = require('./src/routes/parentTestRouter')
const studentTestRouter = require('./src/routes/studentTestRouter')
const examRouter = require('./src/routes/examRouter')

const app = express();

app.use(express.json());
app.use(cors());

// attach model to req
app.use((req, res, next) => {
  req.studentModel = studentModel;
  req.userModel = userModel;
  req.parentTestModel = parentTestModel;
  req.stuTestModel = stuTestModel;
  req.examModel = examModel;



  next();
});

app.use('/api/v1', studentRouter);
app.use('/api/v1', pdfRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1',parentTesti)
app.use('/api/v1',studentTestRouter)
app.use('/api/v1',examRouter)

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

initDb().catch((err) => {
  console.error('❌ DB init failed:', err);
  server.close(() => process.exit(1));
});
