export const APIClient = {
  createChatRoom: (chatRoom) => {
    return HTTPClient.post("/chatrooms", chatRoom);
  },

  deleteChatRoomByUesrIdAndRoomId: (userId, chatRoomId) => {
    return HTTPClient.delete(`/chatrooms/${userId}/leave/${chatRoomId}`);
  },

  getAllUsers: () => {
    return HTTPClient.get("/users/all");
  },

  getChatRoomsByUserId: (userId) => {
    return HTTPClient.get(`/chatrooms?userId=${userId}`);
  },
};

const HTTPClient = {
  get: (url) => {
    return fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch(errorHandler);
  },

  put: (url, data) => {},

  post: (url, data) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .catch(errorHandler);
  },

  delete: (url) => {
    return fetch(url, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .catch(errorHandler);
  },
};

function errorHandler(error) {
  console.error(error);
  throw new Error(`Something went wrong: ${error}`);
}
