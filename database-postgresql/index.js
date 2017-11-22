const pg = require ('pg');


// COMMENTED OUT knex and bookshelf - currently not using

// const knex = require('knex')({
//   client: 'pg',
//   connection: {
//   host     : 'localhost',
//   user     : 'app_user',
//   password : 'app_password', 
//   database : 'app_database',
//   charset  : 'utf8'
//   }
// });

// const bookshelf = require('bookshelf')(knex);


// DB connection strings for testing
// var connectString = "postgres://app_user:app_password@localhost/recipesDB";
// var connectString = "postgres://localhost/recipesDB";
// var connectString = "postgres://localhost/app_database";
// var connectString = "postgres://app_user:app_password@localhost/app_database";

// const client = new pg.Client = connectString;



// Establish new database client
// note: "database-dev" script added to package.json 
const client = new pg.Client(process.env.DATABASE_URL);


// This will SEED our database and create our tables upon run of package.json

const seed = () => {
  const qry = `
    DROP TABLE IF EXISTS recipes;
    CREATE TABLE recipes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) UNIQUE NOT NULL,
      image TEXT,
      ingredients TEXT,
      directions TEXT,
      calories INTEGER,
      servings INTEGER,
      watchers INTEGER      
    );
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(200) UNIQUE     
    );
    DROP TABLE IF EXISTS favorites;
    CREATE TABLE favorites (
      id SERIAL,
      user_id INTEGER NOT NULL REFERENCES users (id),
      recipe_id INTEGER NOT NULL REFERENCES recipes (id),
      PRIMARY KEY (user_id, recipe_id)
    );
  `;
  client.query(qry, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Seed database with tables SUCCESS....', result); //TBD
      //result.rows.forEach((row) => console.log(row.id)) // TBD
    }
  })
}

// Establish connection to database. Call seed() to create the tables
const connect = () => {
  client.connect( (err) => {
    if (!err) {
      if (process.env.SEED)  {
        seed();
        console.log('seeding the database data');
      }
    }
  })  
}


/********** QUERY DATABASE FUNCTIONS *************/

// Query DB for ALL recipes
const getAllRecipes = (cb) => {
  client.query('SELECT * FROM recipes', (err, result) => {
    if (err) {
      return cb(err);
    }
    if ( result.rows.length === 0 ) {
      return cb('no recipe records available');
    }
    cb(null, result.rows);
  })
}

// Query DB for TOP 12 recipes, order descending by number of watchers, 12 limit
const getTopRecipes = (cb) => {
  client.query('SELECT * FROM recipes ORDER BY watchers DESC LIMIT 12', (err, result) => {
    if (err) {
      return cb(err);
    }
    if ( result.rows.length === 0 ) {
      return cb('no recipe records available');
    }
    cb(null, result.rows);
  })
}



// Query DB for ALL users
const getAllUsers = (cb) => {
  client.query('SELECT * FROM users', (err, result) => {
    if (err) {
      return cb(err);
    }
    if ( result.rows.length === 0 ) {
      return cb('no user records available');
    }
    cb(null, result.rows);
  })
}


// Query DB for user's favorite recipes 
// -- TODO -------
//    Note: QUERY IS INCORRECT / INCOMPLETE

const getFavoritesByUser = (userId, cb) => {
  client.query('SELECT userId FROM favorites ORDER BY watchers DESC ', (err, result) => {
    if (err) {
      return cb(err);
    }
    if ( result.rows.length === 0 ) {
      return cb('no user favorites available');
    }
    cb(null, result.rows);
  })
}

// Query DB recipes title and ingredients for search term
// -- TODO --------
//    Note: QUERY IS INCORRECT / INCOMPLETE

const getRecipiesBySearchTerm = (term, cb) => {
  client.query('SELECT * FROM recipes WHERE ', (err, result) => {
    if (err) {
      return cb(err);
    }
    cb(null, result.rows);
  })
}

// Add new user to the list - does not handle authentication but table does prevent duplicate names
const addUser = (userObj, cb) => {
  client.query('INSERT INTO users SET ?'), userObj, (err, result) => {
    if (err) {
      return cb(err);
    }
    console.log(userObj.name + ' was added to database');
    cb(null, result);    
  }
}


// Add new recipe to database
//  --TODO--
//  Q: What will be the new recipe arg format?
//  Fix format of values passed into db query
//  If recipe already exists in recipes table, db will throw error
const addRecipe = (recipeObj, cb) => {
    client.query('INSERT INTO recipes SET ?'), recipeObj, (err, result) => {
    if (err) {
      return cb(err);
    }
    console.log(recipeObj.title + ' was added to recipes table');
    cb(null, result);
    
  }
}


// Add favorite recipe by user 
//   --TODO----
//   NOTE: when a recipe is favorited
//     if it does not already exist in the db 
//       the recipe should be added to recipe table 
//       the watchers count should increment
//       and the recipe id and user id should be added to a new record in favorites
//     else 
//       only the watchers count should increment
//       and the recipe id and user id should be added to a new record in favorites
const addFavoriteByUser = (userName, recipeObj) => {
  client.query('INSERT INTO favorites (user_id, recipe_id) VALUES (userName, password)'), (err, result) => {
    if (err) {
      return cb(err);
    }
    console.log(userName + ' was added to database');
    cb(null, result);
    
  }
}


// Remove favorite recipe by user 
// --- TODO ----
//     Note, when a recipe is removed from user favorites table, 
//     the watch count should go down in the recipe watchers field
const removeFavoriteByUser = () => {}


// Search recipes by term, return recipe matches
const getRecipesBySearchTerm = (term) => {
  client.query('SELECT * FROM recipes WHERE'), (err, result) => {
    if (err) {
      return cb(err);
    }
    cb(null, result.rows);
    
  }
}



/************ EXPORTS *****************/

// module.exports.bookshelf = bookshelf;

module.exports = {
  connect,
  getAllRecipes,
  getTopRecipes,
  getAllUsers,
  getFavoritesByUser,
  getRecipesBySearchTerm,
  addUser,
  addRecipe,
  addFavoriteByUser,
  removeFavoriteByUser
};
