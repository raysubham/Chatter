import React from "react";
import ChatList from "../chatList/chatList";
import ChatView from "../chatView/chatView";
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import * as firebase from "firebase";
import "firebase/firestore";
import ChatTextBox from "../chatTextBox/chatTextBox";
import NewChat from "../newChat/newChat";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: [],
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <>
        <ChatList
          history={this.props.history}
          selectedChatIndex={this.state.selectedChat}
          selectChatFn={this.selectChat}
          newChatBtnFn={this.newChatBtnClicked}
          userEmail={this.state.email}
          chats={this.state.chats}
        />
        {this.state.newChatFormVisible ? null : (
          <ChatView
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
          ></ChatView>
        )}
        {this.state.selectedChat !== null && !this.state.newChatFormVisible ? (
          <ChatTextBox
            messageReadFn={this.messageRead}
            submitMessageFn={this.submitMessage}
          />
        ) : null}
        {this.state.newChatFormVisible ? (
          <NewChat
            newChatSubmitFn={this.newChatSubmit}
            goToChatFn={this.goToChat}
          ></NewChat>
        ) : null}
        <Button className={classes.signOutBtn} onClick={this.signOut}>
          Sign Out
        </Button>
      </>
    );
  }

  submitMessage = (msg) => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_user) => _user !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        recieverHasRead: false,
      });
  };

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find((_chat) =>
      usersInChat.every((_user) => _chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  };

  newChatSubmit = async (chatObj) => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        recieverHasRead: false,
        messages: [
          {
            message: chatObj.message,
            sender: this.state.email,
          },
        ],
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  clickedChatWhereUserNotSender = (chatIndex) =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  messageRead = () => {
    const chatIndex = this.state.selectedChat;
    const docKey = this.buildDocKey(
      this.state.chats[chatIndex].users.filter(
        (_user) => _user !== this.state.email
      )[0]
    );
    if (this.clickedChatWhereUserNotSender(chatIndex)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log("Clicked message where the user was the sender");
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  selectChat = async (chatIndex) => {
    //    console.log("index:", chatIndex);
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  };

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectedChat: null });

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (_user) => {
      if (!_user) {
        this.props.history.push("/login");
      } else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _user.email)
          .onSnapshot(async (response) => {
            const chats = response.docs.map((_doc) => _doc.data());
            await this.setState({
              email: _user.email,
              chats: chats,
            });
            console.log(this.state);
          });
      }
    });
  };
}

export default withStyles(styles)(Dashboard);
