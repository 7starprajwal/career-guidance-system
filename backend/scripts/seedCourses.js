const dotenv = require("dotenv");

const connectDB = require("../config/database");
const Course = require("../models/Course");
const courses = require("../data/courses");

dotenv.config();

const seedCourses = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    let insertedCount = 0;
    let skippedCount = 0;

    for (let index = 0; index < courses.length; index++) {
      const course = courses[index];

      // Generate a stable courseId when the static
      // course data does not already have one.
      const generatedCourseId =
        course.courseId ||
        `course-${String(index + 1).padStart(3, "0")}`;

      const existingCourse = await Course.findOne({
        courseId: generatedCourseId,
      });

      if (existingCourse) {
        console.log(
          `Skipped existing course: ${course.title}`
        );

        skippedCount++;
        continue;
      }

      await Course.create({
        courseId: generatedCourseId,

        title: course.title,
        skill: course.skill,
        category: course.category,
        level: course.level,
        duration: course.duration,

        description: course.description || "",

        topics: Array.isArray(course.topics)
          ? course.topics
          : [],

        provider:
          course.provider ||
          "Career Guidance Learning",

        type:
          course.type ||
          "Learning Path",

        isActive:
          course.isActive !== undefined
            ? course.isActive
            : true,
      });

      console.log(
        `Inserted course: ${course.title}`
      );

      insertedCount++;
    }

    console.log("");
    console.log("================================");
    console.log("COURSE SEEDING COMPLETED");
    console.log("================================");
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(
      `Total source courses: ${courses.length}`
    );
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("Course seeding failed:");
    console.error(error.message);

    if (error.errors) {
      Object.keys(error.errors).forEach((field) => {
        console.error(
          `${field}: ${error.errors[field].message}`
        );
      });
    }

    process.exit(1);
  }
};

seedCourses();