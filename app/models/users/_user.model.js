const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const RandExp = require("randexp");
const notificationService = require("../../services/notification");
const $baseModel = require("../$baseModel");

// RegExp rules
// const usernameRules = /^[a-zA-Z][a-zA-Z0-9]{4,19}$/;
const passwordRules = /^.{6,}$/;
const emailRules =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRules = /^\+201[0125][0-9]{8}$/;
// https://regexr.com/3c53v

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // match: usernameRules,
      index: true,
      sparse: true,
    },
    password: {
      type: String,
      match: passwordRules,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    email: {
      type: String,
      match: emailRules,
      unique: true,
      index: true,
      sparse: true,
    },
    phone: {
      type: String,
      // match: phoneRules,
      unique: true,
      index: true,
      sparse: true,
    },
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/derossy-backup/image/upload/v1555206304/deross-samples/placeholder-profile-male.jpg",
    },
    country: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    code: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
    },
    birthdate: {
      type: Date,
    },
    isAllowedToResetPassword: {
      type: Boolean,
      default: false,
    },
    pushTokens: [
      new mongoose.Schema(
        {
          deviceType: {
            type: String,
            enum: ["android", "ios", "web"],
            required: true,
          },
          deviceToken: {
            type: String,
            required: true,
          },
        },
        { _id: false }
      ),
    ],
  },
  { timestamps: true, discriminatorKey: "role" }
);

const response = (doc, options) => {
  return {
    id: doc.id,
    isAllowedToResetPassword: doc.isAllowedToResetPassword,
    username: doc.username,
    grade: doc.grade, // for student
    gender: doc.gender,
    students: doc.students,//for parent
    subjects: doc.subjects, // for teachers
    sections: doc.sections, // for teachers
    classes: doc.classes, // for teachers
    levels: doc.levels, //for doctors 
    photo: doc.photo,
    email: doc.email,
    phone: doc.phone,
    country: doc.country,
    section: doc.section,
    class: doc.class,
    level: doc.level,
    address: doc.address,
    enabled: doc.enabled,
    birthdate: doc.birthdate,
    pushTokens: doc.pushTokens,
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

schema.methods.isValidPassword = async function (password) {
  const user = this;
  if (!user.activated) {
    return user.password === password;
  }
  return bcrypt.compare(password, user.password);
};

schema.methods.sendNotification = async function (message) {
  let changed = false;
  let len = this.pushTokens.length;
  console.log("1");
  while (len--) {
    console.log("2");
    const deviceToken = this.pushTokens[len].deviceToken;
    try {
      await notificationService.sendNotification(deviceToken, message);
      console.log("successfully");
    } catch (error) {
      console.log(error);
      this.pushTokens.splice(len, 1);
      changed = true;
    }
  }
  if (changed) await this.save();
};

schema.pre("save", async function (next) {
  const user = this;

  let nullableFields = ["phone", "email"];
  for (let i = 0; i < nullableFields.length; i++) {
    if (user.isModified(nullableFields[i])) {
      const value = user[nullableFields[i]];
      if (value === "" || value === null) user[nullableFields[i]] = undefined;
    }
  }

  let uniqueFields = ["email", "phone"];
  for (let i = 0; i < uniqueFields.length; i++) {
    if (user.isModified(uniqueFields[i])) {
      // be true if was undefined then set value to it , be false if same value set to it
      let value = user[uniqueFields[i]];
      if (value === undefined) continue;
      let filter = {};
      filter[uniqueFields[i]] = value;
      let count = await mongoose.model("user").countDocuments(filter);
      if (count) {
        let error = new mongoose.Error.ValidationError(user);
        error.errors[uniqueFields[i]] = {
          message: `(${value}) is not a unique value`,
        };
        throw error;
      }
    }
  }
  return next();
});

schema.statics.generateRandomUsername = async function () {
  let username;
  do {
    username = new RandExp(/^[a-z][a-z0-9]{6}$/).gen();
  } while (await this.findOne({ username: username }));
  return username;
};

schema.statics.generateRandomPassword = async function () {
  return new RandExp(/^[a-z0-9]{6}$/).gen();
};

module.exports = $baseModel("user", schema, {
  responseFunc: response,
  // here you can add any option with in baseSchema
});
