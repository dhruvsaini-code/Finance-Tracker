const AuditLog = require('../models/AuditLog');

class AuditService {
  async log({ userId, action, entityType, entityId, details, req }) {
    try {
      await AuditLog.create({
        user: userId,
        action,
        entityType,
        entityId,
        details,
        ipAddress: req?.ip || req?.connection?.remoteAddress,
        userAgent: req?.headers ? req.headers['user-agent'] : undefined
      });
    } catch (err) {
      // Don't fail the primary action if audit logging fails
      console.error('Audit log failed:', err.message);
    }
  }

  async getLogsByUser(userId, limit = 50) {
    return await AuditLog.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
  }
}

module.exports = new AuditService();
