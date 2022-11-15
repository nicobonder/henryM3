const session = require('supertest-session');
const app = require('../index.js'); // Importo el archivo de entrada del server de express.
const { pluckArray } = require('../pluckutil.js');

const agent = session(app);

describe('Test de APIS', () => {
  describe('GET /', () => {
    it('responds with 200', () => agent.get('/').expect(200));
    it('responds with and object with message `hola`', () =>
        agent.get('/').then((res) => {
          expect(res.body.message).toEqual('hola');
        }));
  });

  describe('GET /test', () => {
    it('responds with 200', () => agent.get('/test').expect(200));
    it('responds with and object with message `test`', () =>
      agent.get('/test').then((res) => {
        expect(res.body.message).toEqual('test');
      }));
  });

  describe('POST /sum', () => {
    it('responds with 200', () => agent.post('/sum').expect(200));
    it('responds with the sum of 2 and 3', () =>
      agent.post('/sum')
        .send({a: 2, b: 3})
        .then((res) => {
          expect(res.body.result).toEqual(5);
        })
    );
  });

  describe('POST /producto', () => {
    it('responds with 200', () => agent.post('/product').expect(200));
    it('responds with the product of 2 and 3', () =>
      agent.post('/product')
        .send({a: 2, b: 3})
        .then((res) => {
          expect(res.body.result).toEqual(6);
        })
    );
  });

  describe('POST /sumArray', () => {
    it('responds with 200', () => agent.post('/sumArray')
    .send({array: [2,5,7,10,11,15,20], num: 13})
    .expect(200));
    it('responds true if num is equal to the sum of two numers inside the array', () =>
      agent.post('/sumArray')
        .send({array: [2,5,7,10,11,15,20], num: 13})
        .then((res) => {
          expect(res.body.result).toEqual(true);
      }));
      it('responds false if num is not equal to the sum of two numers inside the array', () =>
      agent.post('/sumArray')
        .send({array: [2,5,7,10,11,15,20], num: 99})
        .then((res) => {
          expect(res.body.result).toEqual(false);
      }));
      it('responds false if num is equal to the sum of the same number used twice', () =>
      agent.post('/sumArray')
        .send({array: [2,5,7,10,11,15,20], num: 4})
        .then((res) => {
          expect(res.body.result).toEqual(false);
      }));
  });

  describe('GET /numString', () => {
    it('responds with 200', () => agent.get('/numString?q=hola').expect(200));
    it('responds with 400', () => agent.get('/numString').expect(400));
    it('responds with 400', () => agent.get('/numString?q=5').expect(400));
    it('return 4 if query is `hola`', ()=>
      agent.get('/numString?q=hola')
      .then((res) => {
        expect(res.body.result).toBe(4)
      }))
    it('return 6 if query is `comida`', ()=>
    agent.get('/numString?q=comida')
    .then((res) => {
      expect(res.body.result).toBe(6)
    }))
  });

  describe('POST /pluck', () => {
    it('responds with 200', () => agent.post('/pluck')
    .send({array:[{a: 2, b: 3}, {a: 5, b: 8}, {a: 14, b: 7}], prop: a})
    .expect(200));
    it('responds with an array with all the values of property `a`', () => agent.post('/pluck')
    .send({array:[{a: 2, b: 3}, {a: 5, b: 8}, {a: 14, b: 7}], prop: a})
    .then((res) => {
      expect(pluckArray(array, a)).toEqual([2, 5, 14])
    }))
    it('responds with an array with all the values of property `a`', () => agent.post('/pluck')
    .send({array:[{a: 2, b: 3}, {a: 5, b: 8}, {a: 14, b: 7}], prop: a})
    .then((res) => {
      expect(res.body.result).toHaveLength(3)
    }))
  })

});

