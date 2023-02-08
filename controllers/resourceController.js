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

const pg = require('../postgres/postgres');

exports.getStartupResource = (req, res) => {
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

  Promise.all([categoryPromise, collectionPromise, colorPromise, sizePromise])
    .then((dataArr) => {
      res.json({
        status: 'success',
        data: {
          categoryArr: dataArr[0],
          collectionArr: dataArr[1],
          colorArr: dataArr[2],
          sizeArr: dataArr[3],
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
