export class SocketHandler {
  constructor(url, recieveMessageCallback) {
    // let socket = new WebSocket("ws://localhost:8080//websocket-endpoint");
    this.sockjs = new SockJS(url);
    this.stompClient = Stomp.over(this.sockjs);
    this.stompClient.debug = (str) => {
      // console.log(str);
    };
    const sendButton = document.querySelector("#send-button");
    this.stompClient.connect(
      {},
      (frame) => {
        // console.log("Connected: " + frame);
        sendButton.disabled = false;

        this.stompClient.subscribe(
          "/user/topic/messages",
          (message) => {
            // callback function for when a message is received from the server
            console.log("received message: " + message);
            let msg = JSON.parse(message.body);
            // let sender = allUsers.find((user) => user.id === msg.fromUserId);
            // addMessageToContainer(sender.name, msg);
            recieveMessageCallback(msg);
          },
          (error) => {
            // callback function for when an error is received from the server
            console.log("STOMP error: " + error);
          }
        );
      },
      (error) => {
        console.log("STOMP error: " + error);
        sendButton.disabled = true;
      }
    );
  }

  sendMessage(message) {
    this.stompClient.send("/app/chat", {}, JSON.stringify(message));
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    console.log("Disconnected");
  }
}
