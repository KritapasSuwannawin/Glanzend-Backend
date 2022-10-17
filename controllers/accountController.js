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
const cryptoJS = require('crypto-js');

exports.getAccount = (req, res) => {
  const { id } = req.query;

  pg.query(`SELECT * FROM account where id = ${id}`, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      res.json({
        status: 'success',
        data: {
          account: result.rows[0],
        },
      });
    }
  });
};

exports.updateAccount = (req, res) => {
  const { accountID, firstName, lastName, address, zipCode, city, country, phoneNumber, email } = req.body;

  pg.query(
    `UPDATE account SET first_name = '${firstName}', last_name = '${lastName}', address = '${address}', zip_code = '${zipCode}', city = '${city}', country = '${country}', phone_number = '${phoneNumber}', email = '${email}' WHERE id = ${accountID}`,
    (err, result) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      } else {
        res.json({
          status: 'success',
        });
      }
    }
  );
};

exports.registerAccount = (req, res) => {
  const { firstName, lastName, phoneNumber, email, encryptedPassword } = req.body;

  const password = cryptoJS.AES.decrypt(encryptedPassword, process.env.PRIVATE_KEY).toString(cryptoJS.enc.Utf8);

  pg.query(`SELECT register_account('${firstName}', '${lastName}', '${phoneNumber}', '${email}', '${password}')`, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      const returnValue = result.rows[0].register_account;
      if (returnValue === -1) {
        res.json({
          status: 'fail',
          message: 'This email was already used',
        });
      } else {
        res.json({
          status: 'success',
          data: {
            id: returnValue,
          },
        });
      }
    }
  });
};

exports.loginAccount = (req, res) => {
  const { email, encryptedPassword } = req.body;

  const password = cryptoJS.AES.decrypt(encryptedPassword, process.env.PRIVATE_KEY).toString(cryptoJS.enc.Utf8);

  pg.query(`SELECT login_account('${email}', '${password}')`, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      const returnValue = result.rows[0].login_account;
      if (returnValue === -1) {
        res.json({
          status: 'fail',
          message: 'This email was not yet registered',
        });
      } else if (returnValue === 0) {
        res.json({
          status: 'fail',
          message: 'Invalid password',
        });
      } else {
        res.json({
          status: 'success',
          data: {
            id: returnValue,
          },
        });
      }
    }
  });
};

exports.getColumn = (req, res) => {
  const { account_id: accountID, column } = req.query;

  pg.query(`SELECT ${column} FROM account WHERE id = ${accountID} ORDER BY id`, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      res.json({
        status: 'success',
        data: {
          returnValue: result.rows[0][column],
        },
      });
    }
  });
};

exports.updateColumn = (req, res) => {
  const { accountID, lineItemIDArr, operationType } = req.body;

  if (operationType === 'wishlist to cart') {
    pg.query(`CALL add_wishlist_to_cart(${accountID}, ARRAY[${lineItemIDArr}])`, (err, result) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      } else {
        res.json({
          status: 'success',
        });
      }
    });
  } else {
    res.json({
      status: 'error',
      message: 'Invalid operation type',
    });
  }
};

exports.createLineItem = (req, res) => {
  const { accountID, productID, quantity, sizeID, colorID, type } = req.body;

  if (type === 'wishlist') {
    pg.query(`SELECT insert_wishlist_line_item(${accountID}, ${productID}, ${quantity}, ${sizeID}, ${colorID})`, (err, result) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      } else {
        const returnValue = result.rows[0].insert_wishlist_line_item;
        if (returnValue === -1) {
          res.json({
            status: 'fail',
            message: 'This product is currently in the wishlist',
          });
        } else {
          res.json({
            status: 'success',
            data: {
              id: returnValue,
            },
          });
        }
      }
    });
  } else if (type === 'cart') {
    pg.query(`SELECT insert_cart_line_item(${accountID}, ${productID}, ${quantity}, ${sizeID}, ${colorID})`, (err, result) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      } else {
        const returnValue = result.rows[0].insert_cart_line_item;
        if (returnValue === -1) {
          res.json({
            status: 'fail',
            message: 'This product is currently in the cart',
          });
        } else {
          res.json({
            status: 'success',
            data: {
              id: returnValue,
            },
          });
        }
      }
    });
  } else {
    res.json({
      status: 'error',
      message: 'Invalid type',
    });
  }
};

exports.getLineItem = (req, res) => {
  const { line_item_id_arr: lineItemIDArr, type, account_id: accountID } = req.query;

  pg.query(
    `
  SELECT li.*, p.name product_name, p.collection_id, p.price, p.is_in_stock, s.name size_name, c.name color_name FROM line_item li
  INNER JOIN product p ON li.product_id = p.id
  INNER JOIN size s ON li.size_id = s.id
  INNER JOIN color c ON li.color_id = c.id
  WHERE li.id = ANY(ARRAY[${lineItemIDArr}]) 
  AND type = '${type}'
  AND account_id = ${accountID}
  ORDER BY li.id`,
    (err, result) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      } else {
        res.json({
          status: 'success',
          data: {
            lineItemInfo: result.rows,
          },
        });
      }
    }
  );
};

exports.updateLineItem = (req, res) => {
  const { itemID, column, value } = req.body;

  if (column === 'quantity' || column === 'is_checked') {
    pg.query(`UPDATE line_item SET ${column} = ${value} WHERE id = ${itemID}`, (err, result) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      } else {
        res.json({
          status: 'success',
        });
      }
    });
  } else {
    res.json({
      status: 'error',
      message: 'Invalid column',
    });
  }
};

exports.deleteLineItem = (req, res) => {
  const { itemID, accountID, type } = req.body;

  pg.query(`CALL delete_line_item(${itemID}, ${accountID}, '${type}')`, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      res.json({
        status: 'success',
      });
    }
  });
};

exports.createSaleOrder = (req, res) => {
  const { accountID, lineItemArr, shippingInfo } = req.body;

  const { firstName, lastName, address, zipCode, city, country, phoneNumber, email } = shippingInfo;
  const lineItemIDArr = lineItemArr.map((item) => item.id);

  let query = '';

  if (lineItemIDArr[0]) {
    query = `CALL checkout(${accountID}, ARRAY[${lineItemIDArr}], '${firstName}', '${lastName}', '${address}', '${zipCode}', '${city}', '${country}', '${phoneNumber}', '${email}')`;
  } else {
    const { product_id, quantity, size_id, color_id, account_id } = lineItemArr[0];
    query = `CALL instant_buy(${product_id}, ${quantity}, ${size_id}, ${color_id}, ${account_id}, '${firstName}', '${lastName}', '${address}', '${zipCode}', '${city}', '${country}', '${phoneNumber}', '${email}')`;
  }

  pg.query(query, (err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    } else {
      res.json({
        status: 'success',
      });
    }
  });
};

exports.getSaleOrder = (req, res) => {
  const { order_id_arr: orderIDArr, account_id: accountID } = req.query;

  pg.query(
    `SELECT * FROM sale_order WHERE id = ANY(ARRAY[${orderIDArr}]) AND account_id = ${accountID} ORDER BY id DESC`,
    (err, result) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      } else {
        res.json({
          status: 'success',
          data: {
            orderInfo: result.rows,
          },
        });
      }
    }
  );
};
