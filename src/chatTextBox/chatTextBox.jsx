import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import Send from "@material-ui/icons/Send";

class ChatTextBox extends React.Component {
  constructor() {
    super();
    this.state = {
      chatText: "",
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Type your message..."
          className={classes.chatTextBox}
          id="chat-input"
          onKeyUp={(e) => this.userTyping(e)}
          onFocus={this.userClickedInput}
        ></TextField>
        <Send className={classes.sendBtn} onClick={this.submitMessage}></Send>
      </div>
    );
  }
  userTyping = (e) =>
    e.keyCode === 13
      ? this.submitMessage()
      : this.setState({ chatText: e.target.value });

  userClickedInput = () => this.props.messageReadFn();
  messageIsValid = (text) => text && text.replace(/\s/g, "").length;
  submitMessage = () => {
    if (this.messageIsValid(this.state.chatText)) {
      this.props.submitMessageFn(this.state.chatText);
      document.querySelector("#chat-input").value = "";
    }
  };
}
export default withStyles(styles)(ChatTextBox);
