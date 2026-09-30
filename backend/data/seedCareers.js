const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Career = require("../models/Career");
const careers = require("./careers");

dotenv.config();

const seedCareers = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not configured"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected for career seeding"
    );

    let inserted = 0;
    let skipped = 0;

    for (const careerData of careers) {
      const existingCareer =
        await Career.findOne({
          name: careerData.name,
        });

      if (existingCareer) {
        console.log(
          `Skipped existing career: ${careerData.name}`
        );

        skipped += 1;
        continue;
      }

      await Career.create({
        name: careerData.name,
        category:
          careerData.category,
        description:
          careerData.description,
        requiredSkills:
          careerData.requiredSkills || [],
        interests:
          careerData.interests || [],
        behavioralTraits:
          careerData.behavioralTraits || [],
        preferredEducation:
          careerData.preferredEducation || [],
        learningPath:
          careerData.learningPath || [],
        isActive: true,
      });

      console.log(
        `Inserted career: ${careerData.name}`
      );

      inserted += 1;
    }

    console.log("");
    console.log(
      `Career seeding completed. Inserted: ${inserted}, Skipped: ${skipped}`
    );

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "Career seeding failed:",
      error.message
    );

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedCareers();