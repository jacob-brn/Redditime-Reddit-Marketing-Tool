import axios, { AxiosError } from "axios";

interface DeleteKeywordResponse {
  error: string | null;
  message: string | null;
}

interface ApiErrorResponse {
  error: string;
}

const deleteTrackedKeyword = async (
  keywordId: string
): Promise<DeleteKeywordResponse> => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reddit/delete-keyword`,
      {
        keywordId: keywordId,
      },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      return { error: null, message: "Keyword deleted successfully" };
    }

    return {
      error: "Failed to delete keyword: Unexpected response status",
      message: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response) {
        const status = axiosError.response.status;
        if (status === 401) {
          return {
            error: "Unauthorized: Please log in again",
            message: null,
          };
        }
        if (status === 404) {
          return {
            error: "Keyword not found",
            message: null,
          };
        }
        return {
          error: `Failed to delete keyword: ${
            axiosError.response.data?.error || "Server error"
          }`,
          message: null,
        };
      } else if (axiosError.request) {
        return {
          error: "Failed to delete keyword: No response from server",
          message: null,
        };
      }
    }

    return {
      error: "Failed to delete keyword: An unexpected error occurred",
      message: null,
    };
  }
};

export default deleteTrackedKeyword;
