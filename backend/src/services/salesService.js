import Sale from '../models/Sale.js';

class SalesService {
  async getSales(queryParams) {
    const {
      search = '',
      customerRegion = [],
      gender = [],
      ageMin,
      ageMax,
      productCategory = [],
      tags = [],
      paymentMethod = [],
      dateFrom,
      dateTo,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = queryParams;

    // Build filter object
    const filter = {};

    // Search implementation (case-insensitive)
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Multi-select filters
    if (customerRegion.length > 0) {
      filter.customerRegion = { $in: customerRegion };
    }

    if (gender.length > 0) {
      filter.gender = { $in: gender };
    }

    if (productCategory.length > 0) {
      filter.productCategory = { $in: productCategory };
    }

    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    if (paymentMethod.length > 0) {
      filter.paymentMethod = { $in: paymentMethod };
    }

    // Age range filter
    if (ageMin !== undefined && ageMin !== '' || ageMax !== undefined && ageMax !== '') {
      filter.age = {};
      if (ageMin !== undefined && ageMin !== '') {
        const minAge = parseInt(ageMin);
        if (!isNaN(minAge)) filter.age.$gte = minAge;
      }
      if (ageMax !== undefined && ageMax !== '') {
        const maxAge = parseInt(ageMax);
        if (!isNaN(maxAge)) filter.age.$lte = maxAge;
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'date') {
      sort.date = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'quantity') {
      sort.quantity = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'customerName') {
      sort.customerName = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
      const [sales, total] = await Promise.all([
        Sale.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Sale.countDocuments(filter)
      ]);

      return {
        success: true,
        data: sales,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching sales: ${error.message}`);
    }
  }

  async getFilterOptions() {
    try {
      const [
        customerRegions,
        genders,
        productCategories,
        tags,
        paymentMethods,
        ageRange
      ] = await Promise.all([
        Sale.distinct('customerRegion'),
        Sale.distinct('gender'),
        Sale.distinct('productCategory'),
        Sale.distinct('tags'),
        Sale.distinct('paymentMethod'),
        Sale.aggregate([
          {
            $group: {
              _id: null,
              minAge: { $min: '$age' },
              maxAge: { $max: '$age' }
            }
          }
        ])
      ]);

      return {
        success: true,
        data: {
          customerRegions: customerRegions.sort(),
          genders: genders.sort(),
          productCategories: productCategories.sort(),
          tags: tags.flat().filter((tag, index, self) => self.indexOf(tag) === index).sort(),
          paymentMethods: paymentMethods.sort(),
          ageRange: ageRange[0] || { minAge: 0, maxAge: 100 }
        }
      };
    } catch (error) {
      throw new Error(`Error fetching filter options: ${error.message}`);
    }
  }

  async getStatistics(queryParams) {
    const {
      search = '',
      customerRegion = [],
      gender = [],
      ageMin,
      ageMax,
      productCategory = [],
      tags = [],
      paymentMethod = [],
      dateFrom,
      dateTo
    } = queryParams;

    // Build filter object (same as getSales)
    const filter = {};

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (customerRegion.length > 0) filter.customerRegion = { $in: customerRegion };
    if (gender.length > 0) filter.gender = { $in: gender };
    if (productCategory.length > 0) filter.productCategory = { $in: productCategory };
    if (tags.length > 0) filter.tags = { $in: tags };
    if (paymentMethod.length > 0) filter.paymentMethod = { $in: paymentMethod };

    if (ageMin !== undefined && ageMin !== '' || ageMax !== undefined && ageMax !== '') {
      filter.age = {};
      if (ageMin !== undefined && ageMin !== '') {
        const minAge = parseInt(ageMin);
        if (!isNaN(minAge)) filter.age.$gte = minAge;
      }
      if (ageMax !== undefined && ageMax !== '') {
        const maxAge = parseInt(ageMax);
        if (!isNaN(maxAge)) filter.age.$lte = maxAge;
      }
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    try {
      const stats = await Sale.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalUnits: { $sum: '$quantity' },
            totalAmount: { $sum: '$totalAmount' },
            totalDiscount: { $sum: { $multiply: ['$totalAmount', { $divide: ['$discountPercentage', 100] }] } },
            count: { $sum: 1 }
          }
        }
      ]);

      const result = stats[0] || {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        count: 0
      };

      return {
        success: true,
        data: {
          totalUnitsSold: result.totalUnits,
          totalAmount: Math.round(result.totalAmount),
          totalDiscount: Math.round(result.totalDiscount),
          totalTransactions: result.count
        }
      };
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

export default new SalesService();
