const models = require("./schemas");

const createAndSaveUser = (user, done) => {
  let newUser = new models.userModel();
  models.userModel
    .findOne({
      username: user,
    })
    .then((doc) => {
      if (doc == null) {
        newUser.username = user;
        newUser
          .save()
          .then((doc) => {
            done(null, doc);
          })
          .catch((err) => {
            done(err);
          });
      } else {
        done(null, null);
      }
    })
    .catch((err) => console.log(err));
};

const findAllUsers = (done) => {
  models.userModel
    .find({})
    .then((doc) => {
      done(null, doc);
    })
    .catch((err) => {
      done(err);
    });
};

exports.createAndSaveUser = createAndSaveUser;
exports.findAllUsers = findAllUsers;
