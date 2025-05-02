export const getJudge0languageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  https: try {
    const { data } = axios.post(
      `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      }
    );

    console.log("submission token", data);

    return data;
  } catch (error) {
    console.error("Error submitting batch", error.response.data);
    throw error.response.data;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve.ms));

export const pollBatchResult = async () => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: tokens.join(","),
        base64_encoded: false,
      }
    );

    const result = data.submissions;
    const isAllDone = result.every((result) => {
      return result.status.id !== 1 && result.status.id !== 2;
    });

    if (isAllDone) {
      return result;
    }
    await sleep(1000);
  }
};
