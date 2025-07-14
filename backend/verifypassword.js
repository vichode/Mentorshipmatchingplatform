const bcrypt = require('bcrypt');

const hashedPassword = "$2b$10$NwU7tK6/0DKzHd46tUnTFO5qj3J4KY3bQsx9YpxpNnNCN8dACM5lG";
const plainPassword = "password123";

bcrypt.compare(plainPassword, hashedPassword)
  .then(match => {
    console.log(match ? "✅ MATCH: Password correct!" : "❌ MISMATCH: Password incorrect!");
  })
  .catch(err => console.error(err));
