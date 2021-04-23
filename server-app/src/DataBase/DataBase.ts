import pgPromise from 'pg-promise';

const camelizeColumns = (data) => {
  const tmp = data[0];
  for (const prop in tmp) {
    const camel = pgPromise.utils.camelize(prop);
    if (!(camel in tmp)) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

const initOptions = {
  receive(data, result, e) {
    camelizeColumns(data);
  }
};

const db = pgPromise(initOptions)({
  "host": process.env.DB_HOST,
  "port": +process.env.DB_PORT,
  "database": process.env.DB,
  "user": process.env.DB_USER,
  "password": process.env.DB_PASSWORD
});

export default db;