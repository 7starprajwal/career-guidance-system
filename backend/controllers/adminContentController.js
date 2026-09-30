const Career = require("../models/Career");
const Skill = require("../models/Skill");

// =====================================
// CAREERS
// =====================================

// GET ALL CAREERS
const getCareers = async (
  req,
  res
) => {
  try {
    const careers =
      await Career.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: careers.length,
      careers,
    });
  } catch (error) {
    console.error(
      "Admin get careers error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch careers",
    });
  }
};

// CREATE CAREER
const createCareer = async (
  req,
  res
) => {
  try {
    const {
      name,
      category,
      description,
      requiredSkills,
      interests,
      behavioralTraits,
      preferredEducation,
      learningPath,
    } = req.body;

    if (
      !name ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category and description are required",
      });
    }

    const existingCareer =
      await Career.findOne({
        name: name.trim(),
      });

    if (existingCareer) {
      return res.status(409).json({
        success: false,
        message:
          "Career already exists",
      });
    }

    const career =
      await Career.create({
        name: name.trim(),
        category:
          category.trim(),
        description:
          description.trim(),

        requiredSkills:
          Array.isArray(
            requiredSkills
          )
            ? requiredSkills
            : [],

        interests:
          Array.isArray(interests)
            ? interests
            : [],

        behavioralTraits:
          Array.isArray(
            behavioralTraits
          )
            ? behavioralTraits
            : [],

        preferredEducation:
          Array.isArray(
            preferredEducation
          )
            ? preferredEducation
            : [],

        learningPath:
          Array.isArray(
            learningPath
          )
            ? learningPath
            : [],
      });

    return res.status(201).json({
      success: true,
      message:
        "Career created successfully",
      career,
    });
  } catch (error) {
    console.error(
      "Create career error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create career",
    });
  }
};

// UPDATE CAREER
const updateCareer = async (
  req,
  res
) => {
  try {
    const {
      name,
      category,
      description,
      requiredSkills,
      interests,
      behavioralTraits,
      preferredEducation,
      learningPath,
      isActive,
    } = req.body;

    const career =
      await Career.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...(name !== undefined && {
              name: name.trim(),
            }),

            ...(category !== undefined && {
              category:
                category.trim(),
            }),

            ...(description !==
              undefined && {
              description:
                description.trim(),
            }),

            ...(Array.isArray(
              requiredSkills
            ) && {
              requiredSkills,
            }),

            ...(Array.isArray(
              interests
            ) && {
              interests,
            }),

            ...(Array.isArray(
              behavioralTraits
            ) && {
              behavioralTraits,
            }),

            ...(Array.isArray(
              preferredEducation
            ) && {
              preferredEducation,
            }),

            ...(Array.isArray(
              learningPath
            ) && {
              learningPath,
            }),

            ...(isActive !==
              undefined && {
              isActive:
                Boolean(
                  isActive
                ),
            }),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!career) {
      return res.status(404).json({
        success: false,
        message:
          "Career not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Career updated successfully",
      career,
    });
  } catch (error) {
    console.error(
      "Update career error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update career",
    });
  }
};

// DELETE CAREER
const deleteCareer = async (
  req,
  res
) => {
  try {
    const career =
      await Career.findByIdAndDelete(
        req.params.id
      );

    if (!career) {
      return res.status(404).json({
        success: false,
        message:
          "Career not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Career deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete career error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete career",
    });
  }
};

// =====================================
// SKILLS
// =====================================

// GET ALL SKILLS
const getSkills = async (
  req,
  res
) => {
  try {
    const skills =
      await Skill.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error(
      "Admin get skills error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch skills",
    });
  }
};

// CREATE SKILL
const createSkill = async (
  req,
  res
) => {
  try {
    const {
      name,
      category,
      description,
      level,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Skill name and category are required",
      });
    }

    const existingSkill =
      await Skill.findOne({
        name: name.trim(),
      });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message:
          "Skill already exists",
      });
    }

    const skill =
      await Skill.create({
        name: name.trim(),

        category:
          category.trim(),

        description:
          description?.trim() || "",

        level:
          level || "Beginner",
      });

    return res.status(201).json({
      success: true,
      message:
        "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error(
      "Create skill error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create skill",
    });
  }
};

// UPDATE SKILL
const updateSkill = async (
  req,
  res
) => {
  try {
    const {
      name,
      category,
      description,
      level,
      isActive,
    } = req.body;

    const skill =
      await Skill.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...(name !== undefined && {
              name: name.trim(),
            }),

            ...(category !== undefined && {
              category:
                category.trim(),
            }),

            ...(description !==
              undefined && {
              description:
                description.trim(),
            }),

            ...(level !== undefined && {
              level,
            }),

            ...(isActive !==
              undefined && {
              isActive:
                Boolean(
                  isActive
                ),
            }),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message:
          "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error(
      "Update skill error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update skill",
    });
  }
};

// DELETE SKILL
const deleteSkill = async (
  req,
  res
) => {
  try {
    const skill =
      await Skill.findByIdAndDelete(
        req.params.id
      );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message:
          "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Skill deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete skill error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete skill",
    });
  }
};

module.exports = {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,

  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};