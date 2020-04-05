const express = require('express');
const router = express.Router();
const getJobsRecent = require('../scrapper/scrapping');

/* GET JOBS */
router.get('/', async (req, res, next) => {
    const { search } = req.query;
    
    const jobs = await getJobsRecent(search);
    
    res.json({ success: true, jobs })
});

module.exports = router;