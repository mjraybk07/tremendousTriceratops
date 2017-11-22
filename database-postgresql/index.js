const pg = require ('pg');

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

// DB connection string
// var connectString = "postgres://app_user:app_password@localhost/recipesDB"
//const client = new pg.Client = "postgres://localhost/recipesDB";

// Establish new database client
const client = new pg.Client(process.env.DATABASE_URL);

// This will SEED our database and create our tables upon run of package.json
// note: "database-dev" script added to package.json 
const seed = () => {
  const qry = `
    DROP TABLE IF EXISTS recipes;
    CREATE TABLE recipes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      ingredients TEXT,
      directions TEXT,
      calories INTEGER,
      servings INTEGER,
      watchers INTEGER      
    );
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200),
      password VARCHAR(200)      
    );
    DROP TABLE IF EXISTS users_recipes;
    CREATE TABLE users_recipes (
      id SERIAL PRIMARY KEY,
      user_id FOREIGN KEY users_id,
      recipe_id FOREIGN KEY recipes_id     
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

// Establish connection to database
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


// -- TODO --
// Query DB for user's favorite recipes
const getUserFavorites = (userId, cb) => {
  client.query('SELECT * FROM recipes', (err, result) => {
    if (err) {
      return cb(err);
    }
    if ( result.rows.length === 0 ) {
      return cb('no user favorites available');
    }
    cb(null, result.rows);
  })
}

// -- TODO --
// Query DB for recipes title and ingredients for search term
const searchTerm = (term, cb) => {
  client.query('SELECT * FROM recipes', (err, result) => {
    if (err) {
      return cb(err);
    }
    cb(null, result.rows);
  })
}

// Add a user to the list - does not handle authentication but table does prevent duplicate names
const addUser = (userName) => {
  client.query('INSERT INTO users (name) VALUES (userName)'), (err, result) => {
    if (err) {
      return cb(err);
    }
    console.log(userName + ' was added to database');
    cb(null, result);
    
  }
}

/*

var config = {
  host     : 'localhost',
  user     : 'app_user',
  password : 'app_password', 
  database : 'app_database',
  port: 5432,
  max: 10
};

// this initializes a connection pool
// it will keep idle connections open for 30 seconds
// and set a limit of max 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then retun the l=client to the  pool
// ----- this is running a test query of select all recipes ------

pool.connect(connectString, function (err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM recipes', function (err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    res.render('index', {recipes: result.rows});
    
    // call done to release the client back to the pool
    done();
  })
});


pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your app and the DB, the DB restarts, etc.
  // you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})

var recipe = {
  name: 'test test',
  ingredients: 'this is also a test',
  directions: 'this is also a test of a test',
  calories: 540,
  servings: 4,
}


connection.query('insert into recipes set ?', recipe, function(err, results) {
  console.log(query.pg);
} )


var selectAll = function(callback) {
  connection.query('SELECT * FROM recipes', function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};
*/

// module.exports.bookshelf = bookshelf;
//module.exports.selectAll = selectAll;
module.exports = {
  connect,
  getAllRecipes,
  getAllUsers,
  getUserFavorites,
  searchTerm,
  addUser,
};
