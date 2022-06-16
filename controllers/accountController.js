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

exports.registerMember = (req, res) => {
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
