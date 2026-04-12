import e from 'express';
import viewController from '../controllers/viewController.js';
import authController from '../controllers/authController.js';

const viewRouter = e.Router();

viewRouter.use(authController.isLoggedIn);

viewRouter.get('/', viewController.getOverview);
viewRouter.get('/tour/:slug', viewController.getTour);
viewRouter.get('/login', viewController.getLoginForm);

export default viewRouter;

/**
 * @swagger
 * tags:
 *   name: Views
 *   description: Rotas que renderizam páginas HTML
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Renderiza a página inicial com todos os tours
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Página HTML renderizada com sucesso
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

/**
 * @swagger
 * /tour/{slug}:
 *   get:
 *     summary: Renderiza a página de detalhes de um tour pelo slug
 *     tags: [Views]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: "Slug do tour (ex: the-forest-hiker)"
 *     responses:
 *       200:
 *         description: Página HTML do tour renderizada com sucesso
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Tour não encontrado
 */
