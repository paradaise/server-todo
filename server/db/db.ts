import { Sequelize, Model, DataTypes } from 'sequelize';
//mysql://b650da0d595ae9:025d6551@eu-cdbr-west-02.cleardb.net/heroku_896087580b1050f?reconnect=true
const sequelize = new Sequelize('heroku_896087580b1050f', 'b650da0d595ae9', '025d6551', {
    host: 'eu-cdbr-west-02.cleardb.net',
    dialect: 'mysql',
    logging: false,
    define: {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    }
});

class Users extends Model { }
class Posts extends Model { }
Users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "users"
});
Posts.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    owner_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: 'id'
        },
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "posts"
});

Users.hasMany(Posts, { onDelete: 'cascade', foreignKey: 'owner_id' })

export const login = async (login: string) => {
    return await Users.findOne({ raw: true, where: { login } })
        .then((user: any) => {
            if (!user) {
                return null;
            } else {
                return user
            }
        }).catch((err: Error) => console.log(err));
}

export const register = async (login: string, password: string, name: string) => {
    return await Users.create({
        password,
        login,
        name
    }, { raw: true }).then((res: any) => {
        return res;
    }).catch((err: Error) => console.log(err));
}

export const availableLogin = async (login: string) => {
    return await Users.findOne({ raw: true, where: { login } })
        .then((user: any) => {
            if (!user) {
                return true;
            } else {
                return false
            }
        }).catch((err: Error) => console.log(err));
}

export const getUser = async (id: number) => {
    return await Users.findOne({ raw: true, where: { id } })
        .then((user: any) => {
            if (!user) {
                return null;
            } else {
                return user
            }
        }).catch((err: Error) => console.log(err));
}

export const deleteUser = async (id: number) => {
    return await Users.destroy({
        where: {
            id
        }
    }).then((res: number) => {
        return res
    })
}

export const changeUser = async (id: number, data: Object) => {
    return await Users.update(data, {
        where: { id }
    }).then((res: any) => {
        return res;
    });
}
export const addPost = async (userId: number, title: string) => {
    return await Posts.create({
        owner_id: userId,
        title,
    }).then((res: any) => {
        return res;
    }).catch((err: Error) => console.log(err));
}

export const getPost = async (id: number) => {
    return await Posts.findByPk(id)
        .then((post: any) => {
            if (!post) {
                return null;
            } else {
                return post;
            }
        }).catch((err: Error) => console.log(err));
}

export const getAllPosts = async () => {
    return await Posts.findAll({ raw: true })
        .then((posts: any) => {
            if (!posts) {
                console.log("Постов нет");
                return null;
            } else {
                return posts;
            }
        }).catch((err: Error) => console.log(err));
}

export const getPostsByUser = async (user_id: number) => {
    return await Users.findByPk(user_id).then(async (user: any) => {
        if (!user) {
            console.log("Пользователь не найден");
            return null;
        }
        console.log(user);
        return await user.getPosts({ raw: true })
            .then((res: any) => {
                if (!res) {
                    console.log("У этого пользователя нет заметок");
                    return null;
                } else {
                    return res;
                }
            })
            .catch((err: Error) => console.log(err));
    }).catch((err: Error) => console.log(err));
}

export const changePost = async (id: number, data: Object) => {
    return await Posts.update(data, {
        where: { id }
    }).then((res: any) => {
        return res;
    });
}

export const deletePost = async (id: number) => {
    return await Posts.destroy({
        where: {
            id
        }
    }).then((res: number) => {
        return res
    })
}