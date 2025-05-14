import { submitBatch, pollBatchResult } from "./libs/judge0lib.js";
//run and submit in the same controller
export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_output, problemId } =
      req.body;
    const userId = req.user.id;
    //validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid  or Missing test cases" });
    }
    //02:54 fixing judge issues and moving on to the controllers
    //step2 prepare each test cases for judge0
    const submissions = stdin.map((input) => {
      return {
        language_id: language_id,
        source_code: source_code,
        stdin: input,
        problemId: problemId,
      };
    });

    //3. submit  //send this batch to judge)
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => {
      return res.token;
    });

    //4. poll judge0 until all tests are done
    const results = await pollBatchResult(tokens);

    console.log("results", results);

    let allPassed = true;

    const detailedResults = results.map((result, index) => {
      const stdout = result.stdout?.trim();
      const expectedOutput = expected_output[index]?.trim();
      const passed = stdout === expectedOutput;
    });

    res.status(200).json({
      message: "Code executed successfully",
    });
  } catch (error) {
    console.log("Error in executing code ", error);
    res.status(500).json({
      error: "Error executing code",
    });
  }
  //57:00 Building leetcode continue
};
