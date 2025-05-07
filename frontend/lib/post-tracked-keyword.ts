import axios from "axios";

const postTrackedKeyword = async (keyword: string, subreddit: string) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reddit/add-keyword`,
      {
        keyword: keyword,
        subreddit: subreddit,
      },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200)
      return { error: null, message: "Keyword added successfully" };

    return { error: "Failed to add keyword", message: null };
  } catch (error) {
    return { error: "Failed to add keyword", message: null };
  }
};

export default postTrackedKeyword;
