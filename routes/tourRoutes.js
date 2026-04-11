import e from 'express';
import authController from '../controllers/authController.js';
import tourControllers from '../controllers/tourController.js';
import reviewRoute from './reviewRoutes.js';

const tourRouter = e.Router();

// tourRouter.param('id', tourControllers.checkID);

tourRouter
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour,
  )
  .get(tourControllers.getAllTours);

tourRouter
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

tourRouter.route('/stats').get(tourControllers.getTourStats);

tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan,
  );

tourRouter
  .route('/:id')
  .get(tourControllers.getTourByID)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTourByID,
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getTourWithin);

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourControllers.getDistances);

tourRouter.use('/:tourId/reviews', reviewRoute);

export default tourRouter;

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Gerenciamento de tours
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - name
 *         - duration
 *         - maxGroupSize
 *         - difficulty
 *         - price
 *         - summary
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         name:
 *           type: string
 *           description: Nome do tour
 *         duration:
 *           type: number
 *           description: Duração em dias
 *         maxGroupSize:
 *           type: number
 *           description: Tamanho máximo do grupo
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, difficult]
 *         ratingsAverage:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         ratingsQuantity:
 *           type: number
 *         price:
 *           type: number
 *         summary:
 *           type: string
 *         description:
 *           type: string
 *         startDates:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *       example:
 *         name: "The Forest Hiker"
 *         duration: 5
 *         maxGroupSize: 25
 *         difficulty: "easy"
 *         price: 397
 *         summary: "Breathtaking hike through the Canadian Banff National Park"
 */

/**
 * @swagger
 * /api/v1/tours:
 *   get:
 *     summary: Retorna todos os tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, difficult]
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *       - in: query
 *         name: ratingsAverage
 *         schema:
 *           type: number
 *       - in: query
 *         name: duration
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tours retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     tours:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tour'
 *
 *   post:
 *     summary: Cria um novo tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       201:
 *         description: Tour criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas "admin" ou "lead-guide" podem criar tours
 */

/**
 * @swagger
 * /api/v1/tours/top-5-cheap:
 *   get:
 *     summary: Retorna os 5 tours mais baratos e bem avaliados
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     tours:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tour'
 */

/**
 * @swagger
 * /api/v1/tours/stats:
 *   get:
 *     summary: Retorna estatísticas agregadas dos tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: EASY
 *                           numTours:
 *                             type: integer
 *                           numRatings:
 *                             type: integer
 *                           avgRating:
 *                             type: number
 *                           avgPrice:
 *                             type: number
 *                           minPrice:
 *                             type: number
 *                           maxPrice:
 *                             type: number
 */

/**
 * @swagger
 * /api/v1/tours/monthly-plan/{year}:
 *   get:
 *     summary: Retorna o plano mensal de tours de um determinado ano
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ano para o plano mensal
 *         example: 2024
 *     responses:
 *       200:
 *         description: Plano mensal retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     plan:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                           numTourStarts:
 *                             type: integer
 *                           tours:
 *                             type: array
 *                             items:
 *                               type: string
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas "admin", "lead-guide" ou "guide"
 */

/**
 * @swagger
 * /api/v1/tours/{id}:
 *   get:
 *     summary: Retorna um tour pelo ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tour
 *     responses:
 *       200:
 *         description: Tour encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       404:
 *         description: Tour não encontrado
 *
 *   patch:
 *     summary: Atualiza um tour pelo ID
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: Tour atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas "admin" ou "lead-guide"
 *       404:
 *         description: Tour não encontrado
 *
 *   delete:
 *     summary: Deleta um tour pelo ID
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tour deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas "admin" ou "lead-guide"
 *       404:
 *         description: Tour não encontrado
 */

/**
 * @swagger
 * /api/v1/tours/tours-within/{distance}/center/{latlng}/unit/{unit}:
 *   get:
 *     summary: Retorna tours dentro de um raio a partir de uma localização
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: distance
 *         required: true
 *         schema:
 *           type: number
 *         description: Distância do raio de busca
 *       - in: path
 *         name: latlng
 *         required: true
 *         schema:
 *           type: string
 *         description: "Coordenadas no formato: lat,lng (ex: -15.77,-47.92)"
 *       - in: path
 *         name: unit
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mi, km]
 *         description: Unidade de distância
 *     responses:
 *       200:
 *         description: Tours encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Latitude ou longitude não fornecidas
 */

/**
 * @swagger
 * /api/v1/tours/distances/{latlng}/unit/{unit}:
 *   get:
 *     summary: Retorna distâncias de todos os tours a partir de uma localização
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: latlng
 *         required: true
 *         schema:
 *           type: string
 *         description: "Coordenadas no formato: lat,lng (ex: -15.77,-47.92)"
 *       - in: path
 *         name: unit
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mi, km]
 *         description: Unidade de distância
 *     responses:
 *       200:
 *         description: Distâncias retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           distance:
 *                             type: number
 *       400:
 *         description: Latitude ou longitude não fornecidas
 */
