let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/api', function (req, res, next) {
  res.json({ message: 'Hello from the server!' });
});

module.exports = router;


