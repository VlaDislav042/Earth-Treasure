const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const stoneService = require('../services/stoneService');

router.get('/', async(req, res) => {
    const latestStones = await stoneService.getLatest().lean();

    res.render('home', { latestStones });
});

router.get('/404', (req, res) => {
    res.render('404');
})


module.exports = router;