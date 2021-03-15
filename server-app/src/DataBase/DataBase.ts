import pgPromise from 'pg-promise';
import * as config from '../secret/config.json';

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

const db = pgPromise(initOptions)(config);

export default db;