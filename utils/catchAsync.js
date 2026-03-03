const asyncFuction = (fn) => (request, response, next) => {
  fn(request, response, next).catch(next);
};

const catcher = {
  asyncFuction,
};

export default catcher;
