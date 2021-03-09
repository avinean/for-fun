import BaseAPI from './BaseAPI';

export default class API extends BaseAPI {
  
  initRoutes() {
    this.router.get('/', (req, res) => {
      // this.db.one('SELECT * FROM users')
      // .then(function (data) {
      //   res.send(data)
      // })
      // .catch(function (error) {
      //   console.log('ERROR:', error)
      // })
      res.send({a: 1})
    })
    this.router.get('/base', (req, res) => {
      // this.db.one('SELECT * FROM users')
      // .then(function (data) {
      //   res.send(data)
      // })
      // .catch(function (error) {
      //   console.log('ERROR:', error)
      // })
      res.send({a: 1})
    })
  }
}