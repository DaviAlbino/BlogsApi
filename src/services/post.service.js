const { BlogPost, User, Category } = require('../models');

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

module.exports = {
    findAllPosts,
    findPostById,
    updatePost,
};