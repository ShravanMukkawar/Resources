const Branch = require("../models/Branch");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const catchAsync = require('../utils/catchAsync');


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


exports.updateResource = catchAsync(async (req, res, next) => {
  const { branch, semester } = req.query; // Get branch and semester from query parameters
  const { chapterId, resourceId, updates } = req.body;
  console.log(req.body);
  console.log(chapterId);
  console.log(branch);
  console.log(semester);
  console.log(resourceId);

  if (!branch || !semester) {
    return res.status(400).json({ message: "Branch and semester are required." });
  }

  // Find the chapters filtered by branch and semester
  const chapter = await Chapter.findById(chapterId)
    .populate({
      path: "subject",
      populate: {
        path: "semester",
        match: { number: semester },
        populate: {
          path: "branch",
          match: { name: branch },
        },
      },
    })
    .exec();

  if (!chapter || !chapter.subject || !chapter.subject.semester || !chapter.subject.semester.branch) {
    return res.status(404).json({ message: "Chapter not found for the specified branch and semester." });
  }

  // Find the specific resource in the chapter
  const resource = chapter.resources.id(resourceId);
  if (!resource) {
    return res.status(404).json({ message: "Resource not found." });
  }

  // Update the resource fields
  Object.assign(resource, updates);

  // Validate YouTube-specific fields
  if (resource.type === "youtube" && (!resource.from || !resource.to)) {
    return res.status(400).json({ message: "YouTube resources require 'from' and 'to' fields." });
  }

  // Save the updated chapter
  await chapter.save();

  res.status(200).json({
    message: "Resource updated successfully",
    data: resource,
  });
});


