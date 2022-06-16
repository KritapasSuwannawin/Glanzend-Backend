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

exports.registerAccount = (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

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
  const { email, password } = req.body;

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
