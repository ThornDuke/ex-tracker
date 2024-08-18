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

const createAndSaveExercise = (exercise, done) => {
  const id = exercise._id;
  // search for an existing id
  models.userModel
    .findById(id)
    .then((doc) => {
      if (doc == null) {
        // if it doesn't find it does nothing
        done(null, null);
      } else {
        // else create and save an exercise for that id
        let { _id, description, duration, date } = exercise;
        let username = doc.username;

        date = new Date(date).toDateString();
        if (String(date).toLowerCase() == "invalid date") {
          date = new Date(Date.now()).toDateString();
        }
        let newExercise = new models.exerciseModel();
        newExercise.userId = _id;
        newExercise.description = description;
        newExercise.duration = duration;
        newExercise.date = date;
        newExercise
          .save()
          .then((doc) => {
            doc.username = username;
            done(null, doc);
          })
          .catch((err) => {
            done(err);
          });
      }
    })
    .catch((err) => {
      done(err);
    });
};

exports.createAndSaveUser = createAndSaveUser;
exports.findAllUsers = findAllUsers;
exports.createAndSaveExercise = createAndSaveExercise;
