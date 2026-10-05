const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateCurrency(userId, currency) {
    return await User.findByIdAndUpdate(
      userId,
      { preferredCurrency: currency },
      { new: true }
    ).select('-password');
  }
}

module.exports = new UserRepository();
