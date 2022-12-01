const categoryService = require('../services/category.service');
const { categoriesValidation } = require('../utils/categoriesValidation.util');

const insertCategory = async (req, res) => {
    const checkCategory = categoriesValidation(req.body);

    if (checkCategory.type) {
        return res.status(checkCategory.type).json({ message: checkCategory.message });
    }

    const categoryPost = await categoryService.insertCategory(checkCategory);

    return res.status(201).json(categoryPost);
};

module.exports = {
    insertCategory,
};