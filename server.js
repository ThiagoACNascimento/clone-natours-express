import './config.env.js';
import app from './app.js';

const port = process.env.SERVER_PORT || 3000;
app.listen(process.env.SERVER_PORT, () => {
  console.log(`App running on port ${port}`);
});
