/* 

response format

exports.getSetup = (req, res) => {
  const paramProp = req.params.paramProp;
  const bodyProp = req.body.bodyProp;

  res.json({
    status: 'success || fail || error',
    data: {
      data: '...',
    },
    message: 'fail or error because ...',
  });
};

*/

const pg = require('../postgresql/postgresql');

exports.getHomeStartup = (req, res) => {
  const categoryPromise = new Promise((resolve, reject) => {
    pg.query('SELECT * FROM category ORDER BY id', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });

  const collectionPromise = new Promise((resolve, reject) => {
    pg.query('SELECT * FROM collection ORDER BY id', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });

  Promise.all([categoryPromise, collectionPromise])
    .then((dataArr) => {
      res.json({
        status: 'success',
        data: {
          categoryArr: dataArr[0],
          collectionArr: dataArr[1],
        },
      });
    })
    .catch((err) => {
      res.json({
        status: 'error',
        message: err.message,
      });
    });
};

exports.getProductStartup = (req, res) => {
  const colorPromise = new Promise((resolve, reject) => {
    pg.query('SELECT * FROM color ORDER BY id', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });

  const sizePromise = new Promise((resolve, reject) => {
    pg.query('SELECT * FROM size ORDER BY id', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });

  Promise.all([colorPromise, sizePromise])
    .then((dataArr) => {
      res.json({
        status: 'success',
        data: {
          colorArr: dataArr[0],
          sizeArr: dataArr[1],
        },
      });
    })
    .catch((err) => {
      res.json({
        status: 'error',
        message: err.message,
      });
    });
};
