const {faker} = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");

const mongo = new MongoClient("mongodb+srv://kyawkhantwin:kkwkkw22@cluster0.e1dkm4f.mongodb.net/");
let db;

mongo.connect()
  .then(() => {
    db = mongo.db("restaurant");
    seed();
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

const number_of_product = 20;
const number_of_table = 21;
const number_of_shop = 3;
const first_shop_id = new ObjectId('65d1af13547daa9176908ab5');

async function seedShops() {
  await db.collection('shops').deleteMany({});

  const data = [];

  for (let i = 0; i < number_of_shop; i++) {
    const name = faker.person.fullName() 
    const phone = faker.phone.number();
    const location = faker.address.city();
    const userName = faker.internet.userName();
    const password = await bcrypt.hash('password', 10);
    const createdAt = new Date();
    const updatedAt = new Date();

    data.push({
      name, phone, location, userName, password, createdAt, updatedAt
    });
  }

  data.push({
    _id: first_shop_id,
    name: "Shop 1",
    phone: "09457597837",
    location: "Yangon",
    userName: "user",
    password: await bcrypt.hash('password', 10),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    await db.collection('shops').insertMany(data);
    console.log("Shop seeding done.");
  } catch (err) {
    console.error("Error seeding shops:", err);
  }
}

async function seedProducts() {
  await db.collection('products').deleteMany({});
  
  const data = [];
  
  for (let i = 0; i < number_of_product; i++) {
    const name = faker.commerce.productName();
    const price = faker.commerce.price({ min: 1000, max: 4000 });
    const description = faker.lorem.sentence();
    const category = faker.commerce.department();
    const image = faker.image.food() + `?${Date.now()}`;
    const shop = first_shop_id;
    const createdAt = new Date();
    const updatedAt = new Date();
  
    data.push({
      name, price, description, category, image, shop, createdAt, updatedAt
    });
  }
  
  try {
    await db.collection('products').insertMany(data);
    console.log("Product seeding done.");
  } catch (err) {
    console.error("Error seeding products:", err);
  }
}
  
  
async function seedTables() {
  await db.collection('tables').deleteMany({});
  
  const data = [];
  
  for (let i = 1; i <= number_of_table; i++) {
    const shop = first_shop_id;
    const number = i ;
    const capacity = 5;
    const status = 'empty'
    const createdAt = new Date();
    const updatedAt = new Date();
  
    data.push({
      shop, number, capacity,status, createdAt, updatedAt
    });
  }
  
  try {
    await db.collection('tables').insertMany(data);
    console.log("Table seeding done.");
  } catch (err) {
    console.error("Error seeding tables:", err);
  }
}

async function seed() {
  try {
    console.log("Started seeding shops...");
    await seedShops();
  
    console.log("Started seeding products...");
    await seedProducts();
  
    console.log("Started seeding tables...");
    await seedTables();
  } catch (err) {
    console.error("Error seeding:", err);
  } finally {
    process.exit(0);
  }
}
