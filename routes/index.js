const express = require('express');

const { version } = require('../package.json');

const router = express.Router();
/* GET home page. */

router.get('/', (req, res) => {
  res.render('index', {
    title: `Node Sample ${version}`,
    myPartial: () => 'welcome'
  });
});

module.exports = router;
