require('dotenv').config();
const sprintf = require('sprintf-js').sprintf;

const getEnv = (key) => {
  return process.env[key]
};

const connectionString = sprintf(
  "mysql://%s:%s@%s/%s",
  getEnv("MYSQL_ROOT_USER"),
  getEnv("MYSQL_ROOT_PASSWORD"),
  getEnv("HOST"),
  getEnv("MYSQL_DATABASE")
);

module.exports = function (fastify, options, next) {
  fastify.register(require('fastify-mysql'), {
    connectionString
  });

  fastify.get('/', (req, reply) => {
    fastify.mysql.query(
      'SELECT * FROM city', [],
      function onResult (err, result) {
        reply.send(err || result)
      }
    )
  });

  fastify.listen(2001, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
  });

  next()
}