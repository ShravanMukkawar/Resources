const Branch = require("../models/Branch");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
//const ObjectId = mongoose.Types.ObjectId;  // Import ObjectId


exports.getResources = catchAsync(async (req, res, next) => {
  try {
    const { branch, semester } = req.query; // Get branch and semester from query parameters

    if (!branch || !semester) {
      return res.status(400).json({ message: "Branch and semester are required." });
    }

    // Find chapters based on branch and semester using explicit filtering
    const resources = await Chapter.find({})
      .populate({
        path: "subject",
        match: {}, // No direct filter at this level
        populate: {
          path: "semester",
          match: { number: semester }, // Filter based on semester
          populate: {
            path: "branch",
            match: { name: branch }, // Filter based on branch
          },
        },
      })
      .exec();

    // Filter out any chapters where the populated fields don't match the query
    const filteredResources = resources.filter(
      (chapter) =>
        chapter.subject &&
        chapter.subject.semester &&
        chapter.subject.semester.branch
    );

    // Respond with the filtered resources
    res.status(200).json(filteredResources);
  } catch (error) {
    next(error);
  }
});


exports.addResource = catchAsync(async (req, res, next) => {
  try {
    const { branch, semester, subject, chapter, resource } = req.body;

    // Ensure the branch exists or create it
    let branchDoc = await Branch.findOne({ name: branch });
    if (!branchDoc) {
      branchDoc = await Branch.create({ name: branch });
    }

    // Ensure the semester exists or create it
    let semesterDoc = await Semester.findOne({ number: semester, branch: branchDoc._id });
    if (!semesterDoc) {
      semesterDoc = await Semester.create({ number: semester, branch: branchDoc._id });
    }

    // Ensure the subject exists or create it
    let subjectDoc = await Subject.findOne({ name: subject, semester: semesterDoc._id });
    if (!subjectDoc) {
      subjectDoc = await Subject.create({ name: subject, semester: semesterDoc._id });
    }

    // Ensure the Chapter exists or create it
    let ChapterDoc = await Chapter.findOne({ name: chapter, subject: subjectDoc._id });
    if (!ChapterDoc) {
      ChapterDoc = await Chapter.create({ name: chapter, subject: subjectDoc._id, resources: [] });
    }

    // Add the resource to the Chapter
    ChapterDoc.resources.push(resource);
    await ChapterDoc.save();

    res.status(201).json({
      message: "Resource added successfully",
      data: {
        branch: branchDoc.name,
        semester: semesterDoc.number,
        subject: subjectDoc.name,
        chapter: ChapterDoc.name,
        resource: resource,
      },
    });
  } catch (error) {
    next(error);
  }
})

