import axios from "axios";

const updateEmail = async (email: string) => {
  if (!email) return { message: "Missing email" };

  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/update-email",
      {
        email,
      },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) return { message: "Email updated successfully" };

    return { message: "Error updating email" };
  } catch (error) {
    return { message: "Error updating email" };
  }
};

export default updateEmail;
