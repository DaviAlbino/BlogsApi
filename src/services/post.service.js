const { Op } = require('sequelize');
const { BlogPost, User, Category, PostCategory } = require('../models');

const findAllPosts = async () => {
    const postList = BlogPost.findAll({
        include: [
        {
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] },
        }, 
        {
            model: Category,
            as: 'categories',
            through: { attributes: [] },
        },
    ],
    });

    return postList;
};

const findPostById = async (id) => {
    const post = await BlogPost.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] },
            },
            {
                model: Category,
                as: 'categories',
                through: { attributes: [] },
            },
        ],
    });

    if (!post) {
        return { type: 404, message: 'Post does not exist' };
    }

    return { type: null, message: post };
};

const updatePost = async (body, id, user) => {
    const { title, content } = body;

    const { dataValues } = await BlogPost.findOne({
        where: { id }, attributes: ['userId'],
    });

    if (user !== dataValues.userId) {
        return { type: 401, message: 'Unauthorized user' };
    }

    await BlogPost.update({ title, content, updated: new Date() }, { where: { id } });

    const post = await BlogPost.findByPk(id, {
        include: [
            { model: User, as: 'user', where: { id: user } },
            { model: Category, as: 'categories' },
        ],
    });

    return { type: null, message: post };
};

const createPost = async (id, title, content, categoryIds) => {
    const { count } = await Category.findAndCountAll({ where: { id: categoryIds } });
    if (categoryIds.length !== count) {
        return { type: 400, message: 'one or more "categoryIds" not found' };
    }

    const { dataValues } = await BlogPost.create({
        title,
        content,
        published: new Date(),
        updated: new Date(),
        userId: id,
    });

    // console.log('categoryIds: ', categoryIds);

    await Promise.all(categoryIds.map((categoryId) => PostCategory
    .create({ postId: dataValues.id, categoryId })));

    return { type: null, message: dataValues };
};

const findBySearch = async (query) => {
    const searchPosts = await BlogPost.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.like]: `%${query}%` } },
                { content: { [Op.like]: `%${query}%` } },
            ],
        },
        include: [
            { model: User, as: 'user', attributes: { exclude: 'password' } },
            { model: Category, as: 'categories', through: { attributes: [] } },
        ],
    });

    return searchPosts;
};

module.exports = {
    findAllPosts,
    findPostById,
    updatePost,
    findBySearch,
    createPost,
};