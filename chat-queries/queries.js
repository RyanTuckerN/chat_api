const Pool = require("pg").Pool;
const { dbUser, dbPass, dbName } = process.env;

const pool = new Pool({
  user: dbUser,
  host: "localhost",
  database: dbName,
  password: dbPass,
  port: 5432,
});

const getSocketMessages = () => {
  return new Promise(res => {
    pool.query(
      "SELECT * FROM messages ORDER BY id DESC LIMIT 10",
      (err, results) => {
        if (err) throw err
        res(results.rows)
      }
    )
  })
}

const createSocketMessage = message => new Promise(res => {
  pool.query(
    'INSERT INTO messages (text, username) VALUES ($1, $2) RETURNING text, username, created_at',
    [message.text, message.username],
    (err,results) => {
      if (err) throw err
      res(results.row)
    }
  )
})

const getMessages = (req, res) => {
  pool.query(
    "SELECT * FROM messages ORDER BY id DESC LIMIT 10",
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).json(results.rows);
    }
  );
};

const createMessage = (request, response) => {
  console.log(request)
  const { text, username } = request.body;
  pool.query(
    "INSERT INTO messages (text, username) VALUES ($1, $2) RETURNING text, username, created_at",
    [text, username],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(results.rows);
    }
  );
};


module.exports = { getMessages, createMessage, getSocketMessages, createSocketMessage };
