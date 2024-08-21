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

const findLogForUserId = (id, from, to, limit, done) => {
  // find the username
  models.userModel
    .findById(id)
    .then((doc) => {
      if (doc == null) {
        done(null, null);
      } else {
        username = doc.username;
        // find exercises
        models.exerciseModel
          .find({
            userId: id,
            date: {
              $gte: from ? new Date(from) : new Date("1970-01-01"),
              $lte: to ? new Date(to) : new Date(Date.now()),
            },
          })
          .limit(limit ? limit : null)
          .then((doc) => {
            count = doc.length;
            const response = {
              username,
              count,
              _id: id,
              log: doc.map((item) => {
                const { description, duration, date } = item;
                return { description, duration, date: date.toDateString() };
              }),
            };
            done(null, response);
          });
      }
    })
    .catch((err) => done(err));
};

exports.createAndSaveUser = createAndSaveUser;
exports.findAllUsers = findAllUsers;
exports.createAndSaveExercise = createAndSaveExercise;
exports.findLogForUserId = findLogForUserId;
