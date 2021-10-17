module.exports = {
  _user: require("./users/_user.model"),
  admin: require("./users/admin.model"),
  student: require("./users/student.model"),
  teacher: require("./users/teacher.model"),
  parent: require("./users/parent.model"),
  notification: require("./notifications/_notification.model"),
  section: require("./section.model"),
  educationalSystem: require("./educationalSystem.model"),
  level: require("./level.model"),
  class: require("./class.model"),
  section: require("./section.model"),
  subject: require("./subject.model"),
  unite: require("./unite.model"),
  lesson: require("./lesson.model"),
  material: require("./material.model"),
  // m_assignment: require("./material/assignment.model"),
  // m_quiz: require("./material/quiz.model"),
  // m_video: require("./material/video.model"),
  // m_pdf: require("./material/pdf.model"),
  generalExam: require("./exams/generalExam.model"),
  solution: require("./solution.model"),
  _question: require("./Questions/_question.model"),
  complete: require("./Questions/complete.model"),
  truefalse: require("./Questions/truefalse.model"),
  choose: require("./Questions/choose.model"),
  paragraph: require("./Questions/paragraph.model"),
  group: require("./Questions/group.model"),
  voice: require("./Questions/voice.model"),
  _exam: require("./exams/_exam.model"),
  assignment: require("./exams/assignment.model"),
  quiz: require("./exams/quiz.model"),
};
