const prisma = require('../utils/prisma');

class InventoryService {
  async getStockMovements(orgId, productId = null) {
    const where = { organizationId: orgId };
    if (productId) {
      where.productId = productId;
    }
    return await prisma.stockMovement.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async recordMovement(orgId, userId, data) {
    const { productId, type, quantity, reason } = data;

    return await prisma.$transaction(async (tx) => {
      // 1. Verify product belongs to organization
      const product = await tx.product.findUnique({
        where: { id: productId, organizationId: orgId }
      });

      if (!product) {
        throw new Error('Product not found or access denied');
      }

      // 2. Calculate new stock quantity
      let newQuantity = product.stockQuantity;
      if (type === 'IN') {
        newQuantity += quantity;
      } else if (type === 'OUT') {
        if (product.stockQuantity < quantity) {
          throw new Error('Insufficient stock');
        }
        newQuantity -= quantity;
      } else if (type === 'ADJUSTMENT') {
        newQuantity = quantity; // For adjustment, quantity is the new absolute value
      }

      // 3. Update product stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stockQuantity: newQuantity }
      });

      // 4. Record the movement
      const movement = await tx.stockMovement.create({
        data: {
          productId,
          organizationId: orgId,
          userId,
          type,
          quantity: type === 'ADJUSTMENT' ? quantity - product.stockQuantity : quantity,
          reason
        }
      });

      // 5. Create Audit Log
      await tx.auditLog.create({
        data: {
          action: 'STOCK_MOVEMENT',
          entity: 'Product',
          entityId: productId,
          userId,
          organizationId: orgId,
          details: {
            type,
            previousQuantity: product.stockQuantity,
            newQuantity,
            movementId: movement.id
          }
        }
      });

      return { movement, updatedProduct };
    });
  }
}

module.exports = new InventoryService();
