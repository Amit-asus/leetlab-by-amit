import db from "../libs/db.js";
import { pollBatchResult, submitBatch } from "../libs/judge0lib.js";

//admin is going to create a problem and  add it to the database
export const createProblem = async (req, res) => {
  //we will take the data from the body of the request
  const {
    title,
    description,
    difficulty,
    tags,
    example,
    constraints,
    testcases,
    codeSnippets,
    referenceSolution,
  } = req.body;

  //we will check the user role  (Admin) ;
  const { userId } = req.user;
  try {
    if (req.user.role != "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0languageId(language);
      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Invalid language ${language}`,
        });
      }

      const submission = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submission);

      const token = submissionResult.map((res) => {
        return res.token;
      });

      const results = await pollBatchResult(token);

      for (let i = 0; i < result.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Test case ${i + 1} failed`,
          });
        }
      }

      //save the problem in the db

      const newProblem = await db.problem.create({
        userId: req.user.id,
        title,
        description,
        difficulty,
        tags,
        example,
        constraints,
        testcases,
        codeSnippets,
        referenceSolution,
      });
    }
  } catch (error) {}

  // loop thought each solution

  //

  try {
  } catch (error) {}
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();
    if (!problems) {
      return res.status(404).json({
        error: "NO problems found",
      });
    }
    res.json({
      success: true,
      message: "problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error fetching problems",
    });
  }
};

export const getProblemById = (req, res) => {
  try {
    const { id } = req.params;
    const problem = db.problem.findUnique({
      where: {
        id: id,
      },
    });
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error fetching problems",
    });
  }
};

export const updateProblem = (req, res) => {
  const { problemId } = req.params;
  // const {userId} = req.user  ;
  const problem = db.problem.findUnique({
    where: {
      id: problemId,
    },
  });
  //TODO
};
export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await db.problem.findUnique({
      where: {
        id: id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    // If the problem exists, proceed to delete it
    await db.problem.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting problem:", error); // Use console.error for errors
    return res.status(500).json({
      error: "Error while deleting problem",
    });
  }
};

export const getSolvedProblems = (req, res) => {};
