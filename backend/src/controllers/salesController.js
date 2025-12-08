import salesService from '../services/salesService.js';

class SalesController {
  async getSales(req, res) {
    try {
      // Parse array parameters
      const queryParams = {
        ...req.query,
        customerRegion: req.query.customerRegion ? (Array.isArray(req.query.customerRegion) ? req.query.customerRegion : [req.query.customerRegion]) : [],
        gender: req.query.gender ? (Array.isArray(req.query.gender) ? req.query.gender : [req.query.gender]) : [],
        productCategory: req.query.productCategory ? (Array.isArray(req.query.productCategory) ? req.query.productCategory : [req.query.productCategory]) : [],
        tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [],
        paymentMethod: req.query.paymentMethod ? (Array.isArray(req.query.paymentMethod) ? req.query.paymentMethod : [req.query.paymentMethod]) : []
      };

      const result = await salesService.getSales(queryParams);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFilterOptions(req, res) {
    try {
      const result = await salesService.getFilterOptions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getStatistics(req, res) {
    try {
      const queryParams = {
        ...req.query,
        customerRegion: req.query.customerRegion ? (Array.isArray(req.query.customerRegion) ? req.query.customerRegion : [req.query.customerRegion]) : [],
        gender: req.query.gender ? (Array.isArray(req.query.gender) ? req.query.gender : [req.query.gender]) : [],
        productCategory: req.query.productCategory ? (Array.isArray(req.query.productCategory) ? req.query.productCategory : [req.query.productCategory]) : [],
        tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [],
        paymentMethod: req.query.paymentMethod ? (Array.isArray(req.query.paymentMethod) ? req.query.paymentMethod : [req.query.paymentMethod]) : []
      };

      const result = await salesService.getStatistics(queryParams);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new SalesController();
