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

exports.getProduct = (req, res) => {
  const { collection_id, category_id, color_id, min_price, max_price, search, offset = 0, limit = 9 } = req.query;

  let where = '';

  if (collection_id) {
    where += `${where.length > 0 ? ' AND' : 'WHERE'} collection_id = ${collection_id}`;
  }

  if (category_id) {
    where += `${where.length > 0 ? ' AND' : 'WHERE'} category_id = ${category_id}`;
  }

  if (color_id) {
    where += `${where.length > 0 ? ' AND' : 'WHERE'} ${color_id} = ANY (color_id_arr)`;
  }

  if (min_price && max_price) {
    where += `${where.length > 0 ? ' AND' : 'WHERE'} price BETWEEN ${min_price} AND ${max_price}`;
  }

  if (search) {
    where += `${where.length > 0 ? ' AND' : 'WHERE'} name LIKE '%${search.split('_').join(' ')}%'`;
  }

  pg.query(`SELECT * FROM product ${where} ORDER BY id OFFSET ${offset} LIMIT ${limit}`, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      res.json({
        status: 'success',
        data: {
          productArr: result.rows,
        },
      });
    }
  });
};

exports.getProductByID = (req, res) => {
  const { id } = req.params;

  pg.query(`SELECT * FROM product WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      res.json({
        status: 'success',
        data: {
          product: result.rows[0],
        },
      });
    }
  });
};
