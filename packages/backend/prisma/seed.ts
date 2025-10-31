import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Fiction',
        description: 'Fictional literature and novels',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Science Fiction',
        description: 'Science fiction and fantasy literature',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mystery & Thriller',
        description: 'Mystery, thriller, and crime novels',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Romance',
        description: 'Romance novels and love stories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Biography',
        description: 'Biographies and memoirs',
      },
    }),
    prisma.category.create({
      data: {
        name: 'History',
        description: 'Historical books and accounts',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Self-Help',
        description: 'Self-improvement and personal development',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Technology',
        description: 'Technology and programming books',
      },
    }),
  ]);

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@library.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@library.com',
        passwordHash: await bcrypt.hash('manager123', 10),
        firstName: 'Manager',
        lastName: 'User',
        role: 'MANAGER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        passwordHash: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.wilson@example.com',
        passwordHash: hashedPassword,
        firstName: 'Bob',
        lastName: 'Wilson',
      },
    }),
    prisma.user.create({
      data: {
        email: 'alice.johnson@example.com',
        passwordHash: hashedPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie.brown@example.com',
        passwordHash: hashedPassword,
        firstName: 'Charlie',
        lastName: 'Brown',
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana.prince@example.com',
        passwordHash: hashedPassword,
        firstName: 'Diana',
        lastName: 'Prince',
      },
    }),
  ]);

  // Create books
  const books = [];
  const bookDataArray = [
    // Fiction books
    {
      title: 'The Great Gatsby',
      isbn: '978-0-7432-7356-5',
      author: 'F. Scott Fitzgerald',
      description: 'A classic American novel about the Jazz Age and the American Dream.',
      price: 12.99,
      stockQuantity: 25,
      publisher: 'Scribner',
      publicationDate: new Date('1925-04-10'),
      language: 'English',
      pageCount: 180,
      coverImageUrl: 'https://example.com/great-gatsby.jpg',
      categoryId: categories[0].id,
    },
    {
      title: 'To Kill a Mockingbird',
      isbn: '978-0-06-112008-4',
      author: 'Harper Lee',
      description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
      price: 14.99,
      stockQuantity: 30,
      publisher: 'HarperCollins',
      publicationDate: new Date('1960-07-11'),
      language: 'English',
      pageCount: 376,
      coverImageUrl: 'https://example.com/to-kill-mockingbird.jpg',
      categoryId: categories[0].id,
    },
    {
      title: '1984',
      isbn: '978-0-452-28423-4',
      author: 'George Orwell',
      description: 'A dystopian social science fiction novel about totalitarian control.',
      price: 13.99,
      stockQuantity: 20,
      publisher: 'Secker & Warburg',
      publicationDate: new Date('1949-06-08'),
      language: 'English',
      pageCount: 328,
      coverImageUrl: 'https://example.com/1984.jpg',
      categoryId: categories[1].id,
    },
    {
      title: 'Dune',
      isbn: '978-0-441-17271-9',
      author: 'Frank Herbert',
      description: 'An epic science fiction novel set on the desert planet Arrakis.',
      price: 16.99,
      stockQuantity: 15,
      publisher: 'Ace Books',
      publicationDate: new Date('1965-08-01'),
      language: 'English',
      pageCount: 688,
      coverImageUrl: 'https://example.com/dune.jpg',
      categoryId: categories[1].id,
    },
    {
      title: 'The Da Vinci Code',
      isbn: '978-0-385-50420-5',
      author: 'Dan Brown',
      description: 'A mystery thriller involving secret societies and ancient codes.',
      price: 15.99,
      stockQuantity: 22,
      publisher: 'Doubleday',
      publicationDate: new Date('2003-03-18'),
      language: 'English',
      pageCount: 454,
      coverImageUrl: 'https://example.com/da-vinci-code.jpg',
      categoryId: categories[2].id,
    },
    {
      title: 'Gone Girl',
      isbn: '978-0-307-58836-4',
      author: 'Gillian Flynn',
      description: 'A psychological thriller about a missing woman and marital secrets.',
      price: 14.99,
      stockQuantity: 18,
      publisher: 'Crown Publishing',
      publicationDate: new Date('2012-06-05'),
      language: 'English',
      pageCount: 432,
      coverImageUrl: 'https://example.com/gone-girl.jpg',
      categoryId: categories[2].id,
    },
    {
      title: 'Pride and Prejudice',
      isbn: '978-0-14-143951-8',
      author: 'Jane Austen',
      description: 'A romantic novel about manners, upbringing, morality, and marriage.',
      price: 11.99,
      stockQuantity: 28,
      publisher: 'T. Egerton',
      publicationDate: new Date('1813-01-28'),
      language: 'English',
      pageCount: 432,
      coverImageUrl: 'https://example.com/pride-prejudice.jpg',
      categoryId: categories[3].id,
    },
    {
      title: 'The Notebook',
      isbn: '978-0-446-52080-5',
      author: 'Nicholas Sparks',
      description: 'A romantic story of love that endures through time and hardship.',
      price: 13.99,
      stockQuantity: 24,
      publisher: 'Warner Books',
      publicationDate: new Date('1996-10-01'),
      language: 'English',
      pageCount: 224,
      coverImageUrl: 'https://example.com/notebook.jpg',
      categoryId: categories[3].id,
    },
    {
      title: 'Steve Jobs',
      isbn: '978-1-4516-4853-9',
      author: 'Walter Isaacson',
      description: 'The definitive biography of Steve Jobs, co-founder of Apple.',
      price: 19.99,
      stockQuantity: 12,
      publisher: 'Simon & Schuster',
      publicationDate: new Date('2011-10-24'),
      language: 'English',
      pageCount: 656,
      coverImageUrl: 'https://example.com/steve-jobs.jpg',
      categoryId: categories[4].id,
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      isbn: '978-0-06-231609-7',
      author: 'Yuval Noah Harari',
      description: 'A sweeping narrative of human history from the Stone Age to the modern age.',
      price: 17.99,
      stockQuantity: 16,
      publisher: 'Harper',
      publicationDate: new Date('2014-02-10'),
      language: 'English',
      pageCount: 443,
      coverImageUrl: 'https://example.com/sapiens.jpg',
      categoryId: categories[5].id,
    },
    {
      title: 'Atomic Habits',
      isbn: '978-0-7352-1129-2',
      author: 'James Clear',
      description: 'A comprehensive guide to breaking bad habits and adopting good ones.',
      price: 16.99,
      stockQuantity: 20,
      publisher: 'Avery',
      publicationDate: new Date('2018-10-16'),
      language: 'English',
      pageCount: 320,
      coverImageUrl: 'https://example.com/atomic-habits.jpg',
      categoryId: categories[6].id,
    },
    {
      title: 'Clean Code',
      isbn: '978-0-13-235088-4',
      author: 'Robert C. Martin',
      description: 'A handbook of agile software craftsmanship and clean coding practices.',
      price: 24.99,
      stockQuantity: 10,
      publisher: 'Prentice Hall',
      publicationDate: new Date('2008-08-01'),
      language: 'English',
      pageCount: 464,
      coverImageUrl: 'https://example.com/clean-code.jpg',
      categoryId: categories[7].id,
    },
    {
      title: 'The Pragmatic Programmer',
      isbn: '978-0-201-61622-4',
      author: 'Andrew Hunt and David Thomas',
      description: 'A guide to becoming a better programmer through practical advice.',
      price: 22.99,
      stockQuantity: 14,
      publisher: 'Addison-Wesley',
      publicationDate: new Date('1999-10-20'),
      language: 'English',
      pageCount: 352,
      coverImageUrl: 'https://example.com/pragmatic-programmer.jpg',
      categoryId: categories[7].id,
    },
    {
      title: 'JavaScript: The Good Parts',
      isbn: '978-0-596-51774-8',
      author: 'Douglas Crockford',
      description: 'A guide to the best features of JavaScript and how to use them well.',
      price: 18.99,
      stockQuantity: 18,
      publisher: "O'Reilly Media",
      publicationDate: new Date('2008-05-08'),
      language: 'English',
      pageCount: 176,
      coverImageUrl: 'https://example.com/javascript-good-parts.jpg',
      categoryId: categories[7].id,
    },
    {
      title: 'The Catcher in the Rye',
      isbn: '978-0-316-76948-0',
      author: 'J.D. Salinger',
      description: 'A controversial novel about teenage rebellion and alienation.',
      price: 13.99,
      stockQuantity: 26,
      publisher: 'Little, Brown and Company',
      publicationDate: new Date('1951-07-16'),
      language: 'English',
      pageCount: 277,
      coverImageUrl: 'https://example.com/catcher-rye.jpg',
      categoryId: categories[0].id,
    },
    {
      title: 'Harry Potter and the Philosopher\'s Stone',
      isbn: '978-0-7475-3269-9',
      author: 'J.K. Rowling',
      description: 'The first book in the Harry Potter series about a young wizard.',
      price: 15.99,
      stockQuantity: 35,
      publisher: 'Bloomsbury',
      publicationDate: new Date('1997-06-26'),
      language: 'English',
      pageCount: 223,
      coverImageUrl: 'https://example.com/harry-potter-1.jpg',
      categoryId: categories[1].id,
    },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      isbn: '978-0-547-92822-7',
      author: 'J.R.R. Tolkien',
      description: 'The first volume of the epic fantasy trilogy.',
      price: 18.99,
      stockQuantity: 20,
      publisher: 'George Allen & Unwin',
      publicationDate: new Date('1954-07-29'),
      language: 'English',
      pageCount: 423,
      coverImageUrl: 'https://example.com/lotr-fellowship.jpg',
      categoryId: categories[1].id,
    },
    {
      title: 'The Girl with the Dragon Tattoo',
      isbn: '978-0-307-45456-7',
      author: 'Stieg Larsson',
      description: 'A dark mystery thriller about a journalist and a hacker investigating a disappearance.',
      price: 16.99,
      stockQuantity: 19,
      publisher: 'Norstedts Förlag',
      publicationDate: new Date('2005-08-01'),
      language: 'English',
      pageCount: 590,
      coverImageUrl: 'https://example.com/girl-dragon-tattoo.jpg',
      categoryId: categories[2].id,
    },
    {
      title: 'The Alchemist',
      isbn: '978-0-06-112241-5',
      author: 'Paulo Coelho',
      description: 'A philosophical novel about following your dreams and finding your destiny.',
      price: 12.99,
      stockQuantity: 32,
      publisher: 'HarperOne',
      publicationDate: new Date('1988-01-01'),
      language: 'English',
      pageCount: 208,
      coverImageUrl: 'https://example.com/alchemist.jpg',
      categoryId: categories[6].id,
    },
    {
      title: 'Educated',
      isbn: '978-0-399-59478-4',
      author: 'Tara Westover',
      description: 'A memoir about a woman who grows up in a survivalist family and eventually goes to college.',
      price: 17.99,
      stockQuantity: 15,
      publisher: 'Random House',
      publicationDate: new Date('2018-02-20'),
      language: 'English',
      pageCount: 334,
      coverImageUrl: 'https://example.com/educated.jpg',
      categoryId: categories[4].id,
    },
    {
      title: 'The Subtle Art of Not Giving a F*ck',
      isbn: '978-0-06-245771-4',
      author: 'Mark Manson',
      description: 'A counterintuitive approach to living a good life.',
      price: 15.99,
      stockQuantity: 22,
      publisher: 'Harper',
      publicationDate: new Date('2016-09-13'),
      language: 'English',
      pageCount: 224,
      coverImageUrl: 'https://example.com/subtle-art.jpg',
      categoryId: categories[6].id,
    },
    {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      isbn: '978-0-201-63361-0',
      author: 'Gang of Four',
      description: 'The classic reference book on object-oriented design patterns.',
      price: 29.99,
      stockQuantity: 8,
      publisher: 'Addison-Wesley',
      publicationDate: new Date('1994-10-21'),
      language: 'English',
      pageCount: 395,
      coverImageUrl: 'https://example.com/design-patterns.jpg',
      categoryId: categories[7].id,
    },
    {
      title: 'The Hitchhiker\'s Guide to the Galaxy',
      isbn: '978-0-345-39180-3',
      author: 'Douglas Adams',
      description: 'A comedic science fiction series about space travel and the meaning of life.',
      price: 14.99,
      stockQuantity: 25,
      publisher: 'Pan Books',
      publicationDate: new Date('1979-10-12'),
      language: 'English',
      pageCount: 216,
      coverImageUrl: 'https://example.com/hitchhikers-guide.jpg',
      categoryId: categories[1].id,
    },
    {
      title: 'The Name of the Wind',
      isbn: '978-0-7564-0407-9',
      author: 'Patrick Rothfuss',
      description: 'An epic fantasy novel about a gifted young man who grows to be the most notorious magician.',
      price: 16.99,
      stockQuantity: 17,
      publisher: 'DAW Books',
      publicationDate: new Date('2007-03-27'),
      language: 'English',
      pageCount: 662,
      coverImageUrl: 'https://example.com/name-wind.jpg',
      categoryId: categories[1].id,
    },
    {
      title: 'The Martian',
      isbn: '978-0-8041-3902-1',
      author: 'Andy Weir',
      description: 'A science fiction novel about an astronaut stranded on Mars.',
      price: 15.99,
      stockQuantity: 21,
      publisher: 'Crown Publishing',
      publicationDate: new Date('2011-09-01'),
      language: 'English',
      pageCount: 369,
      coverImageUrl: 'https://example.com/martian.jpg',
      categoryId: categories[1].id,
    },
    {
      title: 'The Silent Patient',
      isbn: '978-1-250-30169-7',
      author: 'Alex Michaelides',
      description: 'A psychological thriller about a woman who stops speaking after a violent incident.',
      price: 14.99,
      stockQuantity: 23,
      publisher: 'Celadon Books',
      publicationDate: new Date('2019-02-05'),
      language: 'English',
      pageCount: 336,
      coverImageUrl: 'https://example.com/silent-patient.jpg',
      categoryId: categories[2].id,
    },
    {
      title: 'The Seven Husbands of Evelyn Hugo',
      isbn: '978-1-5011-3467-2',
      author: 'Taylor Jenkins Reid',
      description: 'A captivating story of a reclusive Hollywood icon and her rise to stardom.',
      price: 16.99,
      stockQuantity: 19,
      publisher: 'Atria Books',
      publicationDate: new Date('2017-06-13'),
      language: 'English',
      pageCount: 400,
      coverImageUrl: 'https://example.com/seven-husbands.jpg',
      categoryId: categories[3].id,
    },
    {
      title: 'Becoming',
      isbn: '978-1-5247-6313-8',
      author: 'Michelle Obama',
      description: 'The memoir of former First Lady Michelle Obama.',
      price: 18.99,
      stockQuantity: 14,
      publisher: 'Crown Publishing',
      publicationDate: new Date('2018-11-13'),
      language: 'English',
      pageCount: 448,
      coverImageUrl: 'https://example.com/becoming.jpg',
      categoryId: categories[4].id,
    },
    {
      title: 'Guns, Germs, and Steel',
      isbn: '978-0-393-31755-8',
      author: 'Jared Diamond',
      description: 'A scientific explanation of why Eurasian civilizations developed differently.',
      price: 19.99,
      stockQuantity: 11,
      publisher: 'W.W. Norton & Company',
      publicationDate: new Date('1997-03-01'),
      language: 'English',
      pageCount: 425,
      coverImageUrl: 'https://example.com/guns-germs-steel.jpg',
      categoryId: categories[5].id,
    },
    {
      title: 'Thinking, Fast and Slow',
      isbn: '978-0-374-27563-1',
      author: 'Daniel Kahneman',
      description: 'A groundbreaking exploration of how we think and make decisions.',
      price: 17.99,
      stockQuantity: 16,
      publisher: 'Farrar, Straus and Giroux',
      publicationDate: new Date('2011-10-25'),
      language: 'English',
      pageCount: 499,
      coverImageUrl: 'https://example.com/thinking-fast-slow.jpg',
      categoryId: categories[6].id,
    },
    {
      title: 'You Don\'t Know JS: Up & Going',
      isbn: '978-1-491-92446-4',
      author: 'Kyle Simpson',
      description: 'A beginner-friendly introduction to JavaScript fundamentals.',
      price: 12.99,
      stockQuantity: 30,
      publisher: "O'Reilly Media",
      publicationDate: new Date('2015-03-27'),
      language: 'English',
      pageCount: 88,
      coverImageUrl: 'https://example.com/ydkjs-up-going.jpg',
      categoryId: categories[7].id,
    },
  ];

  for (const bookData of bookDataArray) {
    const book = await prisma.book.create({ data: bookData });
    books.push(book);
  }

  // Create carts for some users
  await Promise.all([
    prisma.cart.create({
      data: {
        userId: users[2].id, // John Doe
        items: {
          create: [
            {
              bookId: books[0].id, // The Great Gatsby
              quantity: 1,
            },
            {
              bookId: books[2].id, // 1984
              quantity: 2,
            },
          ],
        },
      },
    }),
    prisma.cart.create({
      data: {
        userId: users[3].id, // Jane Smith
        items: {
          create: [
            {
              bookId: books[6].id, // Pride and Prejudice
              quantity: 1,
            },
          ],
        },
      },
    }),
  ]);

  // Create some orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[2].id, // John Doe
        status: 'DELIVERED',
        shippingAddress: '123 Main St, Anytown, USA',
        billingAddress: '123 Main St, Anytown, USA',
        items: {
          create: [
            {
              bookId: books[1].id, // To Kill a Mockingbird
              quantity: 1,
              unitPrice: 14.99,
            },
            {
              bookId: books[3].id, // Dune
              quantity: 1,
              unitPrice: 16.99,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[3].id, // Jane Smith
        status: 'PROCESSING',
        shippingAddress: '456 Oak Ave, Somewhere, USA',
        billingAddress: '456 Oak Ave, Somewhere, USA',
        items: {
          create: [
            {
              bookId: books[4].id, // The Da Vinci Code
              quantity: 1,
              unitPrice: 15.99,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[4].id, // Bob Wilson
        status: 'SHIPPED',
        shippingAddress: '789 Pine Rd, Elsewhere, USA',
        billingAddress: '789 Pine Rd, Elsewhere, USA',
        items: {
          create: [
            {
              bookId: books[10].id, // Atomic Habits
              quantity: 1,
              unitPrice: 16.99,
            },
            {
              bookId: books[11].id, // Clean Code
              quantity: 1,
              unitPrice: 24.99,
            },
          ],
        },
      },
    }),
  ]);

  // Create some reviews
  await Promise.all([
    prisma.review.create({
      data: {
        userId: users[2].id, // John Doe
        bookId: books[1].id, // To Kill a Mockingbird
        rating: 5,
        comment: 'A timeless classic that everyone should read. Harper Lee\'s writing is beautiful and the story is incredibly moving.',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[3].id, // Jane Smith
        bookId: books[4].id, // The Da Vinci Code
        rating: 4,
        comment: 'An exciting thriller with lots of twists. The historical elements were fascinating.',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[4].id, // Bob Wilson
        bookId: books[11].id, // Clean Code
        rating: 5,
        comment: 'Essential reading for any software developer. The principles outlined here are timeless.',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[5].id, // Alice Johnson
        bookId: books[6].id, // Pride and Prejudice
        rating: 4,
        comment: 'A charming romance with witty dialogue. Austen\'s social commentary is still relevant today.',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[6].id, // Charlie Brown
        bookId: books[15].id, // Harry Potter
        rating: 5,
        comment: 'Magical! This book transported me back to my childhood. Rowling\'s world-building is incredible.',
      },
    }),
    prisma.review.create({
      data: {
        userId: users[7].id, // Diana Prince
        bookId: books[10].id, // Atomic Habits
        rating: 4,
        comment: 'Practical advice for building better habits. The concepts are simple but powerful.',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${categories.length} categories`);
  console.log(`👥 Created ${users.length} users`);
  console.log(`📚 Created ${books.length} books`);
  console.log(`🛒 Created 2 carts`);
  console.log(`📦 Created ${orders.length} orders`);
  console.log(`⭐ Created 6 reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });