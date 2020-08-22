import React from "react";
import styles from "./styles";
import firebase from "firebase";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Paper,
  withStyles,
  CssBaseline,
  Typography,
} from "@material-ui/core";

class NewChat extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      message: null,
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Send a Message!
          </Typography>
          <br />
          <form
            className={classes.form}
            onSubmit={(e) => this.submitNewChat(e)}
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-username">
                Enter Your Friend's Email
              </InputLabel>
              <Input
                autoFocus
                required
                id="new-chat-username"
                onChange={(e) => this.userTyping("username", e)}
                className={classes.input}
              ></Input>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-message">
                Enter Your Message
              </InputLabel>
              <Input
                className={classes.input}
                required
                onChange={(e) => this.userTyping("message", e)}
                id="new-chat-message"
              ></Input>
            </FormControl>
            <Button
              className={classes.submit}
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Paper>
      </main>
    );
  }

  userTyping = (type, e) => {
    switch (type) {
      case "username":
        this.setState({ username: e.target.value });
        break;
      case "message":
        this.setState({ message: e.target.value });
        break;

      default:
        break;
    }
  };

  submitNewChat = async (e) => {
    e.preventDefault();
    const userExists = await this.userExists();
    if (userExists) {
      const chatExists = await this.chatExists();
      chatExists ? this.goToChat() : this.createChat();
    }
  };

  goToChat = () => this.props.goToChatFn(this.buildDockey(), this.state.message);

  createChat = () => {
    this.props.newChatSubmitFn({
      sendTo: this.state.username,
      message: this.state.message,
    });
  };

  buildDockey = () => {
    return [firebase.auth().currentUser.email, this.state.username]
      .sort()
      .join(":");
  };

  chatExists = async () => {
    const docKey = this.buildDockey();
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();

    console.log(chat.exists);
    return chat.exists;
  };

  userExists = async () => {
    const usersSnapshot = await firebase.firestore().collection("users").get();
    const exists = usersSnapshot.docs
      .map((_doc) => _doc.data().email)
      .includes(this.state.username);
    return exists;
  };
}
export default withStyles(styles)(NewChat);
