import { Router } from 'express';
import { BookController } from '../controllers/book-controller';
import { authenticate, authorize } from '../../infrastructure/http/middlewares';
import { UserRole } from '../../domain/value-objects/user-role';

/**
 * @swagger
 * tags:
 *   name: Livres
 *   description: Gestion des livres
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Obtenir la liste des livres
 *     tags: [Livres]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: ID de la catégorie
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Prix maximum
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, price, createdAt, id]
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordre de tri
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Nombre maximum de résultats
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Décalage pour la pagination
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Curseur pour la pagination
 *     responses:
 *       200:
 *         description: Liste des livres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Rechercher des livres
 *     tags: [Livres]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Terme de recherche
 *         required: true
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: ID de la catégorie
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Prix maximum
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, price, createdAt, id]
 *         description: Champ de tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordre de tri
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Nombre maximum de résultats
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Décalage pour la pagination
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Curseur pour la pagination
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Obtenir un livre par ID
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du livre
 *     responses:
 *       200:
 *         description: Détails du livre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Livre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Créer un nouveau livre (Admin uniquement)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - author
 *               - price
 *               - stockQuantity
 *               - publisher
 *               - publicationDate
 *               - language
 *               - pageCount
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Le Petit Prince"
 *               isbn:
 *                 type: string
 *                 example: "978-2-07-040850-4"
 *               author:
 *                 type: string
 *                 example: "Antoine de Saint-Exupéry"
 *               description:
 *                 type: string
 *                 example: "Un conte philosophique..."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 15.99
 *               stockQuantity:
 *                 type: integer
 *                 example: 100
 *               publisher:
 *                 type: string
 *                 example: "Gallimard"
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: "1943-04-06"
 *               language:
 *                 type: string
 *                 example: "fr"
 *               pageCount:
 *                 type: integer
 *                 example: 96
 *               coverImageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/cover.jpg"
 *               categoryId:
 *                 type: string
 *                 example: "uuid"
 *     responses:
 *       201:
 *         description: Livre créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Mettre à jour un livre (Admin uniquement)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du livre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Le Petit Prince"
 *               author:
 *                 type: string
 *                 example: "Antoine de Saint-Exupéry"
 *               description:
 *                 type: string
 *                 example: "Un conte philosophique..."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 15.99
 *               stockQuantity:
 *                 type: integer
 *                 example: 100
 *               publisher:
 *                 type: string
 *                 example: "Gallimard"
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: "1943-04-06"
 *               language:
 *                 type: string
 *                 example: "fr"
 *               pageCount:
 *                 type: integer
 *                 example: 96
 *               coverImageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/cover.jpg"
 *     responses:
 *       200:
 *         description: Livre mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Livre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Supprimer un livre (Admin uniquement)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du livre
 *     responses:
 *       204:
 *         description: Livre supprimé
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Livre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/books/{id}/stock:
 *   patch:
 *     summary: Mettre à jour le stock d'un livre (Admin uniquement)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du livre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stockQuantity
 *             properties:
 *               stockQuantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *     responses:
 *       204:
 *         description: Stock mis à jour
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Livre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  // Public routes
  router.get('/', bookController.getBooks.bind(bookController));
  router.get('/search', bookController.searchBooks.bind(bookController));
  router.get('/:id', bookController.getBook.bind(bookController));

  // Admin only routes
  router.post('/', authenticate, authorize([UserRole.ADMIN]), bookController.createBook.bind(bookController));
  router.put('/:id', authenticate, authorize([UserRole.ADMIN]), bookController.updateBook.bind(bookController));
  router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), bookController.deleteBook.bind(bookController));
  router.patch('/:id/stock', authenticate, authorize([UserRole.ADMIN]), bookController.updateStock.bind(bookController));

  return router;
}