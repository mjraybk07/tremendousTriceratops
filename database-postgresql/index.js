const pg = require('pg');

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

// DB connect string
// var connectString = "postgres://app_user:app_password@localhost/recipesDB"
//const client = new pg.Client = "postgres://localhost/recipesDB";

const client = new pg.Client(process.env.DATABASE_URL);

// this will seed our database and create our tables
const seed = () => {
  const qry = `
    DROP TABLE IF EXISTS recipes;
    CREATE TABLE recipes (
      id SERIAL PRIMARY KEY,
      title TEXT,
      ingredients TEXT,
      directions TEXT,
      calories INTEGER,
      servings INTEGER,
      watchers INTEGER      
    );
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      password TEXT      
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
      console.log(result); //TBD
      //result.rows.forEach((row) => console.log(row.id)) // TBD
    }
  })
}

const connect = () => {
  client.connect( (err) => {
    if (!err) {
      if (process.env.SEED)  {
        seed();
        console.log('seed some data')
      }
    }
  })  
}

connect();

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
module.exports.selectAll = selectAll;
