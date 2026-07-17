require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');
const Favorite = require('../models/Favorite');

const CATEGORY_TREE = [
  {
    name: 'Fiction',
    children: [
      { name: 'Romance', children: [{ name: 'Classic' }, { name: 'Contemporary' }] },
      { name: 'Fantasy', children: [{ name: 'Epic' }, { name: 'Urban' }] },
    ],
  },
  {
    name: 'Non-Fiction',
    children: [
      { name: 'Biography', children: [{ name: 'Memoir' }, { name: 'Autobiography' }] },
      { name: 'Science', children: [{ name: 'Physics' }, { name: 'Biology' }] },
    ],
  },
  {
    name: 'Technology',
    children: [
      { name: 'Programming', children: [{ name: 'Web Development' }, { name: 'Data Science' }] },
      { name: 'Business', children: [{ name: 'Startups' }, { name: 'Management' }] },
    ],
  },
];

const BOOK_TEMPLATES = {
  Classic: [
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', price: 9.99 },
    { title: 'Jane Eyre', author: 'Charlotte Bronte', isbn: '9780142437209', price: 8.99 },
  ],
  Contemporary: [
    { title: 'Me Before You', author: 'Jojo Moyes', isbn: '9780143124542', price: 11.5 },
    { title: 'The Hating Game', author: 'Sally Thorne', isbn: '9780062439598', price: 10.25 },
  ],
  Epic: [
    { title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', isbn: '9780618640157', price: 14.99 },
    { title: 'A Game of Thrones', author: 'George R. R. Martin', isbn: '9780553593716', price: 13.99 },
  ],
  Urban: [
    { title: 'Storm Front', author: 'Jim Butcher', isbn: '9780451457813', price: 8.5 },
    { title: 'Neverwhere', author: 'Neil Gaiman', isbn: '9780061142023', price: 9.75 },
  ],
  Memoir: [
    { title: 'Educated', author: 'Tara Westover', isbn: '9780399590504', price: 12.99 },
    { title: 'Becoming', author: 'Michelle Obama', isbn: '9781524763138', price: 15.99 },
  ],
  Autobiography: [
    { title: 'The Story of My Experiments with Truth', author: 'Mahatma Gandhi', isbn: '9788172290085', price: 7.5 },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', price: 10.99 },
  ],
  Physics: [
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', price: 11.25 },
    { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson', isbn: '9780393609394', price: 9.99 },
  ],
  Biology: [
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '9780198788607', price: 10.5 },
    { title: 'Silent Spring', author: 'Rachel Carson', isbn: '9780618249060', price: 8.75 },
  ],
  'Web Development': [
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', isbn: '9781593279509', price: 13.5 },
    { title: 'You Dont Know JS Yet', author: 'Kyle Simpson', isbn: '9781091210099', price: 6.99 },
  ],
  'Data Science': [
    { title: 'Python for Data Analysis', author: 'Wes McKinney', isbn: '9781491957660', price: 16.99 },
    { title: 'The Elements of Statistical Learning', author: 'Trevor Hastie', isbn: '9780387848570', price: 24.99 },
  ],
  Startups: [
    { title: 'The Lean Startup', author: 'Eric Ries', isbn: '9780307887894', price: 12.0 },
    { title: 'Zero to One', author: 'Peter Thiel', isbn: '9780804139298', price: 11.0 },
  ],
  Management: [
    { title: 'Good to Great', author: 'Jim Collins', isbn: '9780066620992', price: 13.0 },
    { title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', isbn: '9781982137274', price: 10.99 },
  ],
};

function randomDateWithinMonths(months) {
  const now = Date.now();
  const past = now - months * 30 * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

async function seed() {
  await mongoose.connect(env.MONGO_URI);
  console.log('[seed] Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Book.deleteMany({}),
    Favorite.deleteMany({}),
  ]);
  console.log('[seed] Cleared existing data');

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@bookstore.com',
    password: 'Admin@123',
    role: 'admin',
  });

  const users = await User.create([
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'User@123', role: 'user' },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'User@123', role: 'user' },
    { name: 'Carla Diaz', email: 'carla@example.com', password: 'User@123', role: 'user' },
  ]);
  console.log(`[seed] Created admin + ${users.length} users`);

  const leafCategories = [];

  for (const parent of CATEGORY_TREE) {
    const parentDoc = await Category.create({ name: parent.name, parentId: null, level: 1 });
    for (const child of parent.children) {
      const childDoc = await Category.create({
        name: child.name,
        parentId: parentDoc._id,
        level: 2,
      });
      for (const leaf of child.children) {
        const leafDoc = await Category.create({
          name: leaf.name,
          parentId: childDoc._id,
          level: 3,
        });
        leafCategories.push(leafDoc);
      }
    }
  }
  console.log(`[seed] Created ${leafCategories.length} leaf categories (3-level tree)`);

  const books = [];
  for (const leaf of leafCategories) {
    const templates = BOOK_TEMPLATES[leaf.name] || [];
    for (const tpl of templates) {
      books.push({
        ...tpl,
        description: `${tpl.title} by ${tpl.author} — a must-read in the ${leaf.name} category.`,
        image: '',
        categoryId: leaf._id,
        publishDate: randomDateWithinMonths(36),
        createdAt: randomDateWithinMonths(2),
      });
    }
  }

  const createdBooks = await Book.insertMany(books);
  console.log(`[seed] Created ${createdBooks.length} books`);

  const favoritesToCreate = [];
  users.forEach((user, idx) => {
    const picks = createdBooks.filter((_, i) => i % (idx + 2) === 0).slice(0, 6);
    picks.forEach((book) => {
      favoritesToCreate.push({
        userId: user._id,
        bookId: book._id,
        createdAt: randomDateWithinMonths(1),
      });
    });
  });

  await Favorite.insertMany(favoritesToCreate);
  console.log(`[seed] Created ${favoritesToCreate.length} favorites`);

  console.log('\n[seed] Done! Sample credentials:');
  console.log('  Admin -> admin@bookstore.com / Admin@123');
  console.log('  User  -> alice@example.com / User@123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
