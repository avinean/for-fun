import pgPromise from 'pg-promise';
import * as config from '../secret/config.json';

const db = pgPromise()(config);

export default db;