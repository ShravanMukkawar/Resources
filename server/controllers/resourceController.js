const Branch = require("../models/Branch");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const catchAsync = require('../utils/catchAsync');

exports.getResources = catchAsync(async (req, res, next) => {
    try {
        const { branch, semester, subject, chapter } = req.query;
        console.log(branch, semester, subject, chapter);
        const resources = await Chapter.find({
            name: chapter,
        })
            .populate({
                path: "subject",
                match: { name: subject },
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

        res.status(200).json(resources);
    } catch (error) {
        next(error);
    }
})

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

