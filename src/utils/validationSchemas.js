const { z } = require('zod');

const authSchema = {
  signup: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    orgName: z.string().min(1, 'Organization name is required'),
  }),
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
};

const productSchema = {
  create: z.object({
    sku: z.string().min(1, 'SKU is required'),
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    categoryId: z.string().optional(),
  }),
  update: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().optional(),
  }),
};

const movementSchema = {
  record: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    reason: z.string().optional(),
  }),
};

module.exports = {
  authSchema,
  productSchema,
  movementSchema,
};
