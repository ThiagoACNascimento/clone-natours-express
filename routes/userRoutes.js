import e from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const userRouter = e.Router();

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.use(authController.protect);

userRouter.route('/me').get(userController.getMe, userController.getUserByID);
userRouter.route('/updatePassword').patch(authController.updatePassword);
userRouter.route('/updateMe').patch(userController.updateMe);
userRouter.route('/deleteMe').delete(userController.deleteMe);

userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route('/:id')
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - passwordConfirm
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         role:
 *           type: string
 *           enum: [user, guide, lead-guide, admin]
 *           default: user
 *         active:
 *           type: boolean
 *           default: true
 *       example:
 *         name: "Nikolas Ferreira"
 *         email: "nikolas@example.com"
 *         role: "user"
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nikolas Ferreira"
 *               email:
 *                 type: string
 *                 example: "nikolas@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senha1234"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "senha1234"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Autentica um usuário e retorna o JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nikolas@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senha1234"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *       400:
 *         description: Email ou senha não fornecidos
 *       401:
 *         description: Email ou senha incorretos
 */

/**
 * @swagger
 * /api/v1/users/forgotPassword:
 *   post:
 *     summary: Envia email de recuperação de senha
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nikolas@example.com"
 *     responses:
 *       200:
 *         description: Email de recuperação enviado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /api/v1/users/resetPassword/{token}:
 *   patch:
 *     summary: Redefine a senha usando o token recebido por email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de reset enviado por email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - passwordConfirm
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "novaSenha1234"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "novaSenha1234"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *       400:
 *         description: Token inválido ou expirado
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 */

/**
 * @swagger
 * /api/v1/users/updatePassword:
 *   patch:
 *     summary: Atualiza a senha do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordCurrent
 *               - password
 *               - passwordConfirm
 *             properties:
 *               passwordCurrent:
 *                 type: string
 *                 format: password
 *                 example: "senhaAtual123"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "novaSenha123"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *       401:
 *         description: Senha atual incorreta
 */

/**
 * @swagger
 * /api/v1/users/updateMe:
 *   patch:
 *     summary: Atualiza nome e email do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nikolas Ferreira"
 *               email:
 *                 type: string
 *                 example: "nikolas@example.com"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Tentativa de atualizar senha por esta rota
 *       401:
 *         description: Não autenticado
 */

/**
 * @swagger
 * /api/v1/users/deleteMe:
 *   delete:
 *     summary: Desativa a conta do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Conta desativada com sucesso
 *       401:
 *         description: Não autenticado
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retorna todos os usuários (apenas admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas admins
 *
 *   post:
 *     summary: Cria um usuário (apenas admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       403:
 *         description: Apenas admins
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID (apenas admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Apenas admins
 *       404:
 *         description: Usuário não encontrado
 *
 *   patch:
 *     summary: Atualiza um usuário pelo ID (apenas admin)
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       403:
 *         description: Apenas admins
 *       404:
 *         description: Usuário não encontrado
 *
 *   delete:
 *     summary: Deleta um usuário pelo ID (apenas admin)
 *     tags: [Users]
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
 *         description: Usuário deletado com sucesso
 *       403:
 *         description: Apenas admins
 *       404:
 *         description: Usuário não encontrado
 */
