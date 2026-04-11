import e from 'express';
import reviewController from '../controllers/reviewController.js';
import authController from '../controllers/authController.js';

const reviewRoute = e.Router({ mergeParams: true });

reviewRoute.use(authController.protect);

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Gerenciamento de avaliações de tours
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - review
 *         - rating
 *         - tour
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         review:
 *           type: string
 *           description: Texto da avaliação
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Nota de 1 a 5
 *         tour:
 *           type: string
 *           description: ID do tour avaliado
 *         author:
 *           type: string
 *           description: ID do usuário autor da avaliação
 *       example:
 *         review: "Tour incrível, recomendo muito!"
 *         rating: 5
 *         tour: "64abc123def456"
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Retorna todas as avaliações
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações retornada com sucesso
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
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *       401:
 *         description: Não autenticado
 *
 *   post:
 *     summary: Cria uma nova avaliação
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *               - tour
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Tour incrível!"
 *               rating:
 *                 type: number
 *                 example: 5
 *               tourId:
 *                 type: string
 *                 example: "64abc123def456"
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Tour não encontrado ou dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas usuários com role "user" podem criar avaliações
 */

reviewRoute
  .route('/')
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.create,
  )
  .get(reviewController.getAllReviews);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Retorna uma avaliação pelo ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Avaliação encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Avaliação não encontrada
 *       401:
 *         description: Não autenticado
 *
 *   patch:
 *     summary: Atualiza uma avaliação pelo ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Atualizando minha avaliação!"
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       403:
 *         description: Apenas "user" ou "admin" podem atualizar
 *       404:
 *         description: Avaliação não encontrada
 *
 *   delete:
 *     summary: Deleta uma avaliação pelo ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da avaliação
 *     responses:
 *       204:
 *         description: Avaliação deletada com sucesso
 *       403:
 *         description: Apenas "user" ou "admin" podem deletar
 *       404:
 *         description: Avaliação não encontrada
 *       401:
 *         description: Não autenticado
 */

reviewRoute
  .route('/:id')
  .get(reviewController.getOneById)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

export default reviewRoute;
