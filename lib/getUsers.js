let UserSchema = require('../models/user');

function getUsers(email){
    return new Promise((resolve, reject)=>{
    UserSchema.find({email}, (err,docs) =>{
        if(err) reject(err);

        resolve(docs);
    });
});
}


module.exports = getUsers;