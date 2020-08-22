import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

class ChatView extends React.Component {
  componentDidUpdate = () => {
    const container = document.getElementById("chatview-container");
    container.scrollTo(0, container.scrollHeight);
  };
  render() {
    const { classes, chat, user } = this.props;

    if (chat === undefined) {
      return <main id="chatview-container" className={classes.content}></main>;
    } else if (chat !== undefined) {
      return (
        <div>
          <div className={classes.chatHeader}>
            Your Conversation with{" "}
            {chat.users.filter((_user) => _user !== user)[0]}
          </div>
          <main id="chatview-container" className={classes.content}>
            {chat.messages.map((_message, _index) => {
              return (
                <div
                  key={_index}
                  className={
                    _message.sender === user
                      ? classes.userSent
                      : classes.friendSent
                  }
                >
                  {_message.message}
                </div>
              );
            })}
          </main>
        </div>
      );
    }
  }
}
export default withStyles(styles)(ChatView);
