const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const Event = require("../models/Event");
const catchAsync = require("../utils/catchAsync");

const moment = require('moment');


const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") {
        throw new Error("Invalid date format");
    }

    const [day, month, year] = dateStr.split("-").map(Number);
    const fullYear = year < 50 ? 2000 + year : 1900 + year; // Handle 2-digit year

    // Create the date in UTC to avoid timezone issues
    const date = new Date(Date.UTC(fullYear, month - 1, day));

    return date;
};


exports.addEventsFromCSV = catchAsync(async (req, res, next) => {
    const filePath = "uploads/abc.csv";
    const events = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
            // Ensure we use the exact case-sensitive key names from the CSV
            const date = row['Date']?.trim(); // Note: "Date" is the correct key here
            if (!date) {
                console.log("Skipping row due to missing Date field:", row);
                return;
            }

            const event = {
                date: parseDate(date),  // Your date parsing logic here
                holidays: row['Holidays']?.trim() || null,  // Use exact field names
                examination: row['Examination']?.trim() || null,
                academicActivities: row['Academic Activities']?.trim() || null,
                extraCurricularActivities: row['Extra-curricular Activities']?.trim() || null,
                specialDaysJayantis: row['Special Days and Jayantis']?.trim() || null,
            };
            console.log(event);

            events.push(event);
        })
        .on("end", async () => {
            try {
                if (events.length === 0) {
                    return res.status(400).json({ message: "No valid events found in the CSV file." });
                }
                await Event.insertMany(events);
                res.status(201).json({ message: `${events.length} events added successfully.` });
            } catch (error) {
                next(error);
            }
        })
        .on("error", (error) => {
            next(error);
        });
});





// Get all events
exports.getEvents = catchAsync(async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(200).json({
            len: events.length, // Include the number of events found
            data: events // Include the events data
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching events" });
    }
});

// Add a new event
exports.addEvent = catchAsync(async (req, res, next) => {
    try {
        const {
            date,
            holidays,
            examination,
            academicActivities,
            extraCurricularActivities,
            specialDaysJayantis,
        } = req.body;

        if (!date) {
            return res.status(400).json({ error: "Date is required." });
        }

        const newEvent = new Event({
            date,
            holidays,
            examination,
            academicActivities,
            extraCurricularActivities,
            specialDaysJayantis,
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: "Error adding event" });
    }
});


exports.updateAllEventsDate = catchAsync(async (req, res, next) => {
    try {
        // Get all events from the database
        const events = await Event.find();

        if (!events || events.length === 0) {
            return res.status(404).json({ error: "No events found." });
        }

        // Iterate over each event and update the date
        const updatedEventsPromises = events.map(async (event) => {
            const newDate = moment(event.date).add(1, 'days'); // Add 1 day to the current date

            event.date = newDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"); // Format the date as needed

            return await event.save(); // Save the updated event
        });

        // Wait for all events to be updated
        const updatedEvents = await Promise.all(updatedEventsPromises);

        // Respond with the updated events
        res.status(200).json({
            message: `${updatedEvents.length} events updated successfully.`,
            updatedEvents,
        });
    } catch (error) {
        next(error);
    }
});


exports.deleteEvent = catchAsync(async (req, res, next) => {
    try {
        // Delete all events from the Event collection
        const result = await Event.deleteMany({});

        // If no events were deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No events found to delete." });
        }

        res.status(200).json({
            message: `${result.deletedCount} events deleted successfully.`,
        });
    } catch (error) {
        next(error);
    }
});


exports.getEventByDate = catchAsync(async (req, res, next) => {
    try {
        const { date } = req.params; // Extract date from URL parameter

        // Parse the date to ensure it's in the correct format
        const parsedDate = parseDate(date); // You can use the parseDate function to convert to a Date object
        console.log(parsedDate);

        // Find events for the given date (adjusting for any timezone issues)
        const events = await Event.find({
            date: {
                $gte: parsedDate.setHours(0, 0, 0, 0), // Set to midnight for exact date match
                $lt: parsedDate.setHours(23, 59, 59, 999), // Set to the end of the day
            }
        });

        if (!events.length) {
            return res.status(404).json({ message: "No events found for this date." });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Error fetching events by date" });
    }
});
