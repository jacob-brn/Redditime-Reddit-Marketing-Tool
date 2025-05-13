import axios, { AxiosError } from "axios";

export interface TrackedKeyword {
  id: string;
  keyword: string;
  subreddit: string;
  iconUrl: string | null;
}

export interface ScheduledPost {
  id: string;
  title: string;
  scheduledFor: string;
  subreddit: string;
  status: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface NewPost {
  title: string;
  content: string;
  scheduledDate: Date;
  subreddit: string;
}

interface ApiResponse {
  subscriptions: TrackedKeyword[];
  error?: string;
}

interface ScheduledPostsResponse {
  success: boolean;
  data: ScheduledPost[];
  count: number;
  error?: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchTrackedKeywords(): Promise<TrackedKeyword[]> {
  try {
    const response = await api.get<ApiResponse>(
      "/api/reddit/my-tracked-keywords"
    );

    if (response.data.error) {
      if (response.data.error === "No keywords found") {
        return [];
      }
      throw {
        message: response.data.error,
        status: response.status,
      } as ApiError;
    }

    if (!response.data.subscriptions) {
      throw {
        message: "Invalid response format",
        status: 500,
      } as ApiError;
    }

    return response.data.subscriptions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;

      if (axiosError.response) {
        if (axiosError.response.data?.error === "No keywords found") {
          return [];
        }
        throw {
          message: axiosError.response.data?.error || "An error occurred",
          status: axiosError.response.status,
          code: axiosError.code,
        } as ApiError;
      } else if (axiosError.request) {
        throw {
          message: "No response received from server",
          code: axiosError.code,
        } as ApiError;
      } else {
        throw {
          message: axiosError.message,
          code: axiosError.code,
        } as ApiError;
      }
    }

    throw {
      message: "An unexpected error occurred",
    } as ApiError;
  }
}

export async function fetchScheduledPosts(): Promise<ScheduledPost[]> {
  try {
    const response = await api.get<ScheduledPostsResponse>(
      "/api/reddit/scheduled-posts"
    );

    if (response.data.error) {
      throw {
        message: response.data.error,
        status: response.status,
      } as ApiError;
    }

    if (!response.data.success) {
      throw {
        message: "Failed to fetch scheduled posts",
        status: 500,
      } as ApiError;
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;

      if (axiosError.response) {
        throw {
          message: axiosError.response.data?.error || "An error occurred",
          status: axiosError.response.status,
          code: axiosError.code,
        } as ApiError;
      } else if (axiosError.request) {
        throw {
          message: "No response received from server",
          code: axiosError.code,
        } as ApiError;
      } else {
        throw {
          message: axiosError.message,
          code: axiosError.code,
        } as ApiError;
      }
    }

    throw {
      message: "An unexpected error occurred",
    } as ApiError;
  }
}

export async function schedulePost(post: NewPost): Promise<ScheduledPost> {
  try {
    const response = await api.post<ScheduledPost>(
      "/api/reddit/schedule-post",
      {
        title: post.title,
        content: post.content,
        subreddit: post.subreddit,
        scheduledFor: post.scheduledDate.toISOString(),
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;

      if (axiosError.response) {
        throw {
          message: axiosError.response.data?.error || "Failed to schedule post",
          status: axiosError.response.status,
          code: axiosError.code,
        } as ApiError;
      } else if (axiosError.request) {
        throw {
          message: "No response received from server",
          code: axiosError.code,
        } as ApiError;
      } else {
        throw {
          message: axiosError.message,
          code: axiosError.code,
        } as ApiError;
      }
    }

    throw {
      message: "An unexpected error occurred",
    } as ApiError;
  }
}

export async function deleteScheduledPost(id: string): Promise<void> {
  try {
    const response = await api.post(`/api/reddit/scheduled-posts/delete`, {
      id,
    });
    if (!response.data.success) {
      throw {
        message: "Failed to delete post",
        status: response.status,
      } as ApiError;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;

      if (axiosError.response) {
        throw {
          message: axiosError.response.data?.error || "Failed to delete post",
          status: axiosError.response.status,
          code: axiosError.code,
        } as ApiError;
      } else if (axiosError.request) {
        throw {
          message: "No response received from server",
          code: axiosError.code,
        } as ApiError;
      } else {
        throw {
          message: axiosError.message,
          code: axiosError.code,
        } as ApiError;
      }
    }

    throw {
      message: "An unexpected error occurred",
    } as ApiError;
  }
}
