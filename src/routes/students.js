const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/Student");

const router = express.Router();

function sendError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({ message: "That roll number already exists. Please use a unique roll number." });
  }
  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0];
    return res.status(400).json({ message: firstError ? firstError.message : "Please check your input." });
  }
  console.error(error);
  return res.status(500).json({ message: "Something went wrong on the server." });
}

// READ all students; optional search: /api/students?search=noor
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { rollNumber: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { course: { $regex: search, $options: "i" } }
          ]
        }
      : {};
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    sendError(res, error);
  }
});

// READ one student
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (error) {
    sendError(res, error);
  }
});

// CREATE student
router.post("/", async (req, res) => {
  try {
    const { name, rollNumber, email, course } = req.body;
    const student = await Student.create({ name, rollNumber, email, course });
    res.status(201).json(student);
  } catch (error) {
    sendError(res, error);
  }
});

// UPDATE student
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }
    const { name, rollNumber, email, course } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNumber, email, course },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (error) {
    sendError(res, error);
  }
});

// DELETE student
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    sendError(res, error);
  }
});

module.exports = router;
