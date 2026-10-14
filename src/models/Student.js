const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required."],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters."],
      maxlength: [80, "Name cannot exceed 80 characters."]
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required."],
      trim: true,
      unique: true,
      maxlength: [30, "Roll number cannot exceed 30 characters."]
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: [120, "Email cannot exceed 120 characters."],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."]
    },
    course: {
      type: String,
      required: [true, "Course is required."],
      trim: true,
      maxlength: [100, "Course cannot exceed 100 characters."]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
