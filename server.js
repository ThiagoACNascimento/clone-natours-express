import './config.env.js';
import app from './app.js';
import mongoose from 'mongoose';

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const tourSechema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSechema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.SERVER_PORT || 3000;
app.listen(process.env.SERVER_PORT, () => {
  console.log(`App running on port ${port}`);
});
