require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
const SavingsGoal = require('./models/SavingsGoal');
const RecurringTransaction = require('./models/RecurringTransaction');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance_tracker';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Transaction.deleteMany({}),
      Budget.deleteMany({}),
      SavingsGoal.deleteMany({}),
      RecurringTransaction.deleteMany({})
    ]);

    // 1. Create Demo User
    const user = await User.create({
      name: 'Dhruv Saini',
      email: 'demo@example.com',
      password: 'password123',
      role: 'user',
      preferredCurrency: 'USD'
    });
    console.log(`Created demo user: ${user.email}`);

    // 2. Create Sample Budgets
    await Budget.insertMany([
      { user: user._id, category: 'Housing', limit: 2000, period: 'monthly', warningThresholdPercent: 80 },
      { user: user._id, category: 'Food & Dining', limit: 800, period: 'monthly', warningThresholdPercent: 75 },
      { user: user._id, category: 'Transportation', limit: 400, period: 'monthly', warningThresholdPercent: 80 },
      { user: user._id, category: 'Entertainment', limit: 350, period: 'monthly', warningThresholdPercent: 85 },
      { user: user._id, category: 'Utilities & Subscriptions', limit: 300, period: 'monthly', warningThresholdPercent: 90 }
    ]);

    // 3. Create Sample Savings Goals
    await SavingsGoal.insertMany([
      {
        user: user._id,
        name: 'Emergency Fund',
        targetAmount: 15000,
        currentAmount: 11200,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        category: 'Safety',
        color: '#10B981',
        icon: 'ShieldCheck'
      },
      {
        user: user._id,
        name: 'Tesla Model 3 Downpayment',
        targetAmount: 12000,
        currentAmount: 7500,
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        category: 'Vehicle',
        color: '#3B82F6',
        icon: 'Car'
      },
      {
        user: user._id,
        name: 'Tokyo & Kyoto Vacation',
        targetAmount: 5000,
        currentAmount: 3800,
        targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        category: 'Travel',
        color: '#F59E0B',
        icon: 'Plane'
      },
      {
        user: user._id,
        name: 'Tech & AI Workstation Upgrade',
        targetAmount: 4000,
        currentAmount: 2900,
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        category: 'Tech',
        color: '#8B5CF6',
        icon: 'Laptop'
      }
    ]);

    // 4. Create Sample Recurring Transactions
    await RecurringTransaction.insertMany([
      {
        user: user._id,
        amount: 5500,
        category: 'Salary',
        description: 'Primary Software Engineering Paycheck',
        type: 'income',
        frequency: 'monthly',
        nextOccurrence: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        user: user._id,
        amount: 1750,
        category: 'Housing',
        description: 'Luxury Apartment Rent & Parking',
        type: 'expense',
        frequency: 'monthly',
        nextOccurrence: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      },
      {
        user: user._id,
        amount: 24.99,
        category: 'Utilities & Subscriptions',
        description: 'Netflix 4K + Spotify Family Bundle',
        type: 'expense',
        frequency: 'monthly',
        nextOccurrence: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        user: user._id,
        amount: 120,
        category: 'Health & Fitness',
        description: 'Equinox Gym & Spa Membership',
        type: 'expense',
        frequency: 'monthly',
        nextOccurrence: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
      }
    ]);

    // 5. Create Realistic Transactions Ledger
    const transactions = [];
    const now = new Date();

    const sampleData = [
      { desc: 'Tech Corp Senior Salary', amount: 5500, type: 'income', cat: 'Salary', daysAgo: 2 },
      { desc: 'Freelance AI Consulting', amount: 1450, type: 'income', cat: 'Freelance', daysAgo: 5 },
      { desc: 'Whole Foods Market Groceries', amount: 164.20, type: 'expense', cat: 'Food & Dining', daysAgo: 1 },
      { desc: 'Blue Bottle Artisanal Coffee', amount: 8.50, type: 'expense', cat: 'Food & Dining', daysAgo: 2 },
      { desc: 'Equinox Fitness Club', amount: 120.00, type: 'expense', cat: 'Health & Fitness', daysAgo: 4 },
      { desc: 'Uber Premier Ride to Downtown', amount: 38.40, type: 'expense', cat: 'Transportation', daysAgo: 6 },
      { desc: 'Apple Developer Account Renewal', amount: 99.00, type: 'expense', cat: 'Utilities & Subscriptions', daysAgo: 8 },
      { desc: 'Fine Dining Bistro & Drinks', amount: 185.00, type: 'expense', cat: 'Food & Dining', daysAgo: 9 },
      { desc: 'Amazon AWS Cloud Infrastructure', amount: 74.30, type: 'expense', cat: 'Utilities & Subscriptions', daysAgo: 11 },
      { desc: 'Nordstrom Designer Apparel', amount: 240.00, type: 'expense', cat: 'Shopping', daysAgo: 14 },
      { desc: 'Shell Premium Gasoline', amount: 55.00, type: 'expense', cat: 'Transportation', daysAgo: 16 },
      { desc: 'Quarterly Stock Dividend Yield', amount: 380.00, type: 'income', cat: 'Investments', daysAgo: 18 },
      { desc: 'Home Internet Fiber Gigabit', amount: 80.00, type: 'expense', cat: 'Utilities & Subscriptions', daysAgo: 20 },
      { desc: 'Monthly Condo Rent Payment', amount: 1750.00, type: 'expense', cat: 'Housing', daysAgo: 25 },
      { desc: 'Previous Month Tech Salary', amount: 5500.00, type: 'income', cat: 'Salary', daysAgo: 32 },
      { desc: 'Michelin Star Dinner with Family', amount: 320.00, type: 'expense', cat: 'Food & Dining', daysAgo: 35 },
      { desc: 'Sephora Skincare Essentials', amount: 95.00, type: 'expense', cat: 'Shopping', daysAgo: 38 },
      { desc: 'Tesla Supercharging Station', amount: 28.50, type: 'expense', cat: 'Transportation', daysAgo: 42 }
    ];

    sampleData.forEach((item) => {
      const date = new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000);
      transactions.push({
        user: user._id,
        description: item.desc,
        amount: item.amount,
        type: item.type,
        category: item.cat,
        date,
        tags: [item.cat.toLowerCase(), item.type],
        notes: `Sample transaction generated for ${item.desc}`
      });
    });

    await Transaction.insertMany(transactions);
    console.log(`Seeded ${transactions.length} sample transactions!`);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
