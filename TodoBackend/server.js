
//* cd TodoBackend

const http = require('http');
let {
    getAllUsers,
    getUserById,
    postUser,
    deleteUser,
    putUser
} = require('./controllers/productControllers')

const server = http.createServer(function (req, res) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Max-Age": 2592000, // 30 days
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token, Origin, Authorization"
    };

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    console.log(req.url + "  " + " METHOD:" + req.method);

    if (req.url == '/user' && req.method == 'GET') {
        getAllUsers(req, res);
    } else if (req.url.match(/\/user\/\w+/) && req.method === "GET") {//regex
        const id = req.url.split('/')[2];
        getUserById(req, res, id);
    } else if (req.url === "/user" && req.method === 'POST') {
        postUser(req, res)
    } else if (req.url.match(/\/user\/\w+/) && req.method === "DELETE") {//regex
        const id = req.url.split('/')[2];
        deleteUser(req, res, id);
    } else if (req.url.match(/\/user\/\w+/) && req.method === "PUT") {//regex
        const id = req.url.split('/')[2];
        putUser(req, res, id);
    } else {
        console.log('invalid url');
    }
})

server.listen(3000, () => console.log('Server is running'));