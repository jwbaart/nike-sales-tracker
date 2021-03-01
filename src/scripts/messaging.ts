import axios from "axios";

export const deleteToken = async (id: string) => {
  axios.delete("/messagingToken", { data: JSON.stringify({ id }) });
};

export const addToken = async (id: string) => {
  axios.put("/messagingToken", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: { id },
  });
};
