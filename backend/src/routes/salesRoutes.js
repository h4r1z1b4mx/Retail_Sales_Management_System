import express from 'express';
import salesController from '../controllers/salesController.js';
import { cacheMiddleware } from '../utils/cacheMiddleware.js';

const router = express.Router();

// Cache sales data for 2 minutes (120 seconds)
router.get('/sales', cacheMiddleware(120), salesController.getSales);

// Cache filter options for 10 minutes (600 seconds) - rarely changes
router.get('/filter-options', cacheMiddleware(600), salesController.getFilterOptions);

// Cache statistics for 2 minutes (120 seconds)
router.get('/statistics', cacheMiddleware(120), salesController.getStatistics);

export default router;
