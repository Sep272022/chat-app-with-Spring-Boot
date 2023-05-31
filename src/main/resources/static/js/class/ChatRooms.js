
export class ChatRooms {

  #currentChatRoom = null;

  constructor() {
    this.chatRooms = [];
  }

  setChatRooms(chatRooms) {
    this.chatRooms = chatRooms;
  }

  addChatRoom(chatRoom) {
    this.chatRooms.push(chatRoom);
  }

  removeChatRoomById(chatRoomId) {
    this.chatRooms = this.chatRooms.filter(room => room.id !== chatRoomId);
    return this.chatRooms;
  }

  getChatRooms() {
    return this.chatRooms;
  }

  addChatRoom(chatRoom) {
    this.chatRooms.push(chatRoom);
  }

  getCurrentChatRoom() {
    return this.#currentChatRoom;
  }

  setCurrentChatRoom(chatRoom) {
    this.#currentChatRoom = chatRoom;
  }

  getChatRoomById(id) {
    return this.chatRooms.find(chatRoom => chatRoom.id === id);
  }

  getChatRoomWith(user) {
    return this.chatRooms.find(chatRoom => chatRoom.members.find(member => member.id === user.id));
  }

}
