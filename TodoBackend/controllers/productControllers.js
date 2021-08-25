const { getUsers, postCreatUser, getId, deletModulUser, putModulUser } = require('../models/productModules');
const { getUserData } = require('../utils/utils');

async function getAllUsers(req, res) {
    try {
        console.log(1);
        const users = await getUsers();
        if (!users) {
            res.writeHead(404, { 'Content-type': 'application/json' })
            res.end(JSON.stringify({ message: "users not found" }))
        }
        else {
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.write(JSON.stringify(users))
            res.end()
        }
    } catch (err) {
        res.writeHead(500, { "Content-type": "application/json" })
        res.write(JSON.stringify({ message: err.message }))
        res.end()
    }
}

async function getUserById(req, res, id) {
    try {
        console.log(id + ' ' + 1);
        const user = await getId(id);
        console.log(id + ' ' + 2);

        if (!user) {
            res.writeHead(404, { 'Content-type': 'application/json' })
            res.end(JSON.stringify({ message: "Product not found" }))
        }
        else {
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.write(JSON.stringify(user))
            res.end()
        }
    } catch (err) {
        res.writeHead(500, { "Content-type": "application/json" })
        res.write(JSON.stringify({ message: err.message }))
        res.end()
    }
}

async function postUser(req, res) {
    try {

        const user = await getUserData(req, res)
        let str = JSON.parse(JSON.stringify(user))
        const saveUser = await postCreatUser(str);
        console.log(typeof saveUser + " 3 " + saveUser);
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.write(JSON.stringify(saveUser));
        res.end();

    } catch (err) {
        res.writeHead(400, { 'Content-type': 'application/json' })
        res.write(JSON.stringify({ message: err }))
        res.end()
    }
}

async function deleteUser(req, res, id) {
    try {
        const user = await getId(id)
        if (!user) {
            res.writeHead(404, { 'Content-type': 'application/json' })
            res.end(JSON.stringify({ message: "Product not found" }))
        }
        else {
            const userDelete = await deletModulUser(id)
            console.log(typeof userDelete + " 3 " + userDelete);
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.write(JSON.stringify({
                message: "Product has been deleted",
                todo: {
                    ...JSON.parse(JSON.stringify(userDelete))
                }
            }))
            res.end()
        }
    } catch (err) {
        console.log(err.message);
    }
}

async function putUser(req, res, id) {
    try {
        const user = await getId(id);
        console.log(typeof user + " abc " + user);
        if (!user) {
            res.writeHead(404, { 'Content-type': 'application/json' })
            res.end(JSON.stringify({ message: "Product not found" }))
        }
        else {
            const obj = await putModulUser(id, user)
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.write(JSON.stringify({
                message: "Product has been updated",
                id: user._id,
                completed: user.completed
            }))
            res.end()
        }
    } catch (err) {
        res.writeHead(500, { 'Content-type': 'application/json' })
        res.write(JSON.stringify({ message: err.message }))
        res.end()
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    postUser,
    deleteUser,
    putUser
}
