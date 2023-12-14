// run in mongo shell

const conn = new Mongo();
const db = conn.getDB("nodeJSDB");

db.getCollection("products").deleteMany({});

db.getCollection('products').insertMany([
  {'item': 'Chleb', 'price': 1, 'quantity': 500,'img':'https://piekarniapajda.pl/wp-content/uploads/2020/03/oliwski.png'},
  {'item': 'Kurki', 'price': 5, 'quantity': 400,'img':'https://www.lokalnywarzywniak.pl/1065-large_default/grzyby-kurki-swieze.jpg'},
  {'item': 'Kura', 'price': 30, 'quantity': 200, 'img':'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHx8&w=1000&q=80'},
  {'item': 'Selected Ambient Works Volume II', 'price': 4, 'quantity': 100,'img':'https://upload.wikimedia.org/wikipedia/en/1/12/Selected_Ambient_Works_Volume_II_cover.jpg'},
  {'item': 'Łopata', 'price': 60, 'quantity': 50,'img':'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwoQTxDnrAdEidriCPyJGt8Mmsgy4N4DimdpxVUuZuGzM2JkJwHHVqENCPQ4oVq6WXNlsJMwUdXjob0CcF7tqsKYZHE9EdYU/360fx360f'},
  {'item': 'Słoma', 'price': 4, 'quantity': 5000,'img':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Zbalowana_s%C5%82oma.jpg/1200px-Zbalowana_s%C5%82oma.jpg'},
  {'item': 'Masło', 'price': 7.5, 'quantity': 100,'img':'https://www.spozywczetechnologie.pl/media/k2/items/cache/f9bbdeb62248e2fc4418a6935e64cf4c_L.jpg'},
  {'item': 'ROOT', 'price': 100, 'quantity': 15,'img':'https://files.rebel.pl/products/100/302/_110788/www.portalgames.pl-root-1625-1200x900-ffffff.png'}
]);

console.log(db.getCollection('products').find({}));
