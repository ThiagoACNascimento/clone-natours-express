import './utils/errors-init.js';
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
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (error) => {
  console.log(error.name, error.message);
  console.log('UNHANDLER REJECTION... SHUTTING DOWN');
  server.close(() => {
    process.exit(1);
  });
});
