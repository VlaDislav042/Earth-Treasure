const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const stoneService = require('../services/stoneService');
const { getErrorMessage } = require('../utils/errorUtils');


router.get('/create', isAuth, (req, res) => {
    res.render('stones/create')
});

router.post('/create', isAuth, async (req, res) => {
    const stoneData = req.body;

    try {
        await stoneService.create(req.user._id, stoneData);

        res.redirect('/stones')
    } catch (err) {
        res.render('stones/create', { ...stoneData, error: getErrorMessage(err) })
    }
});

router.get('/', async (req, res) => {
    const stones = await stoneService.getAll().lean();

    res.render('stones/dashboard', { stones })
});


router.get('/:stoneId/details', async (req, res) => {
    const stone = await stoneService.getOneDetailed(req.params.stoneId).lean();
    const isOwner = stone.owner && stone.owner._id == req.user?._id;
    const isLiked = stone.likedList.some(user => user._id == req.user?._id);

    res.render('stones/details', { ...stone, isOwner, isLiked });
});

router.get('/:stoneId/like', async (req, res) => {
    await stoneService.like(req.params.stoneId, req.user._id);

    res.redirect(`/stones/${req.params.stoneId}/details`)
});

router.get('/:stoneId/delete', isStoneOwner, async (req, res) => {
    await stoneService.delete(req.params.stoneId);

    res.redirect('/stones')
});

async function isStoneOwner(req, res, next) {
    const stone = await stoneService.getOne(req.params.stoneId).lean();
    if (stone.owner != req.user?._id) {
        return res.redirect(`/stones/${req.params.stoneId}/details`);
    }

    req.stone = stone;

    next();
};

router.get('/:stoneId/edit', isStoneOwner, (req, res) => {
    res.render('stones/edit', { ...req.stone });
});

router.post('/:stoneId/edit', isStoneOwner, async (req, res) => {
    const stoneData = req.body;
    try {
        await stoneService.edit(req.params.stoneId, stoneData)

        res.redirect(`/stones/${req.params.stoneId}/details`);
    } catch (err) {
        res.render('/courses/edit', { ...stoneData, error: getErrorMessage(err) });
    }
});

module.exports = router;