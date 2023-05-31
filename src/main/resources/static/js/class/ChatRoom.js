
export class ChatRoom {

  buttonDomElement = null;

  constructor(chatRoom) {
    this.id = chatRoom.id;
    this.name = chatRoom.name;
    this.members = chatRoom.members;
    this.messages = chatRoom.messages;
  }

  getId() {
    return this.id;
  }

  getName() {
    if (this.name === "") {
      return this.getNameWithMembers();
    }
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getNameWithMembers() {
    let names = [];
    this.members.forEach((member) => {
      names.push(member.email);
    });
    return names.join(", ");
  }

  getMembers() {
    return this.members;
  }

  getMemberById(id) {
    return this.members.find(member => member.id === id);
  }

  getMessages() {
    return this.messages;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  getChatRoom() {
    return {
      id: this.id,
      name: this.name,
      members: this.members,
      messages: this.messages
    }
  }

  setButtonDomElement(buttonDomElement) {
    this.buttonDomElement = buttonDomElement;
  }

  click() {
    if (this.buttonDomElement) {
      this.buttonDomElement.click();
    }
  }

  print() {
    console.log(this.getChatRoom());
  }
}
