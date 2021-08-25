const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/todoList", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongodbga ulanish muvaffaqiyatli amalga oshdi");
    })
    .catch(err => {
        console.log(err.message);
    });


const userSchema = new mongoose.Schema({
    title: { type: String, require: true },
    completed: {
        type: Boolean,
        default: false,
    }
});

const UserstDate = mongoose.model("todo", userSchema);

async function getUsers() {
    return await UserstDate.find(
        {
            _id: {
                $exists: true
            }
        },
        function (err, docs) {
            if (docs) {
                console.log(docs);
            } else {
                console.log(err);
            }
        }
    )
}


async function postCreatUser(userObj) {
    const user = new UserstDate({
        title: JSON.parse(userObj).title
    });
    return await user.save();
}

async function getId(id) {
    return await UserstDate.findOne({ _id: id });
}

async function deletModulUser(id) {
    let docs1;
    await UserstDate.findOneAndDelete(
        { _id: id },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                docs1 = docs;
            }
        }
    )
    return await docs1;
}

async function putModulUser(id, user) {
    console.log(user, id);
    let boolean = user.completed
    if (boolean) {
        boolean = false;
    } else {
        boolean = true;
    }
    return await UserstDate.updateOne(
        { _id: id },
        {
            $set: {
                completed: boolean
            }
        }
    )
}

module.exports = {
    getUsers,
    postCreatUser,
    getId,
    deletModulUser,
    putModulUser
}