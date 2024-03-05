const User = require('../models/User');
const Stone = require('../models/Stone');

exports.create = async (userId, stoneData) => {
    const createdStone = await Stone.create({
        owner: userId,
        ...stoneData,
    });

    await User.findByIdAndUpdate(userId, { $push: { createdStones: createdStone._id } });

    return createdStone;
};

exports.getAll = () => Stone.find();

exports.getOne = (stoneId) => Stone.findById(stoneId);

exports.getOneDetailed = (stoneId) => Stone.findById(stoneId).populate('owner').populate('likedList');

exports.like = async(stoneId, userId) => {
    const stone = await Stone.findById(stoneId);
    const user = await User.findById(userId);

    stone.likedList.push(userId);
    user.likedStones.push(stoneId);

    await stone.save();
    await user.save();
};

exports.delete = (stoneId) => Stone.findByIdAndDelete(stoneId);

exports.edit = (stoneId, stoneData) => Stone.findByIdAndUpdate(stoneId, stoneData, {runValidators: true});

exports.getLatest = () => Stone.find().sort({createdAd: -1}).limit(3);