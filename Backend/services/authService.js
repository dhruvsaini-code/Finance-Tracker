const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_finance_tracker_key_123456',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_987654',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async register({ name, email, password, preferredCurrency }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      preferredCurrency: preferredCurrency || 'USD'
    });

    const tokens = this.generateTokens(user);
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role, preferredCurrency: user.preferredCurrency }, ...tokens };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const tokens = this.generateTokens(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredCurrency: user.preferredCurrency
      },
      ...tokens
    };
  }
}

module.exports = new AuthService();
