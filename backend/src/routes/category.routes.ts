import express from 'express';
import { getCategories, createCategory, getCategoryById } from '../controllers/category.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, admin, createCategory);

export default router;
