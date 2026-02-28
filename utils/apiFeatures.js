class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((element) => delete queryObject[element]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    const queryStringParsed = JSON.parse(queryString);

    this.query.find(queryStringParsed);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fieldBy = this.queryString.fields.split(',').join(' ');
      if (fieldBy.includes('-')) {
        fieldBy = `${fieldBy} -__v`;
      }
      this.query = this.query.select(fieldBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limitBy = Number(this.queryString.limit) || 100;
    const skipBy = (page - 1) * limitBy;

    this.query = this.query.skip(skipBy).limit(limitBy);

    return this;
  }
}

export default APIFeatures;
