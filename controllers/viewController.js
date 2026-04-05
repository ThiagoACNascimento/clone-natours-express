const getOverview = (request, response) => {
  response.status(200).render('overview', {
    title: 'All Tours',
  });
};

const getTour = (request, response) => {
  response.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};

const viewController = {
  getOverview,
  getTour,
};

export default viewController;
