function getUserData(req, res) {
    const promise = new Promise((resolve, reject) => {
        let body = [];
        req.on('data', function (chunk) {
            body += chunk
        })
        req.on('end', function () {
            resolve(body);
        })
        req.on('error', function (error) {
            reject(error);
        })
    })

    return promise;
}

module.exports = {
    getUserData
}