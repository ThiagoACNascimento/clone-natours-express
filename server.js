import './config.env.js';
import mongoose from 'mongoose';
import app from './app.js';

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.SERVER_PORT || 3000;
app.listen(process.env.SERVER_PORT, () => {
  console.log(`App running on port ${port}`);
});
