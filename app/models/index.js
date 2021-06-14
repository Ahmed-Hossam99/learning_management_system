module.exports = {
  _user: require("./users/_user.model"),
  admin: require("./users/admin.model"),
  student: require("./users/student.model"),
  notification: require("./notifications/_notification.model"),
  system: require("./system.model"),
  level: require("./level.model"),
  class: require("./class.model"),
  _course: require("./courses/_course.model"),
  subject: require("./courses/subject.model"),
};
