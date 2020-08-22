import React from "react";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "firebase";
import styles from "./styles";

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      passwordConfirmation: null,
      signupError: "",
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={(e) => this.submitSignup(e)}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="email-submit">Enter Your Email</InputLabel>
              <Input
                autoFocus
                autoComplete="email"
                id="email-submit"
                onChange={(e) => this.userTyping("email", e)}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="password-submit">
                Create A Password
              </InputLabel>
              <Input
                type="password"
                autoComplete="password"
                id="password-submit"
                onChange={(e) => this.userTyping("password", e)}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="password-confirmation-submit">
                Enter Your Password
              </InputLabel>
              <Input
                type="password"
                autoComplete="password"
                id="password-confirmation-submit"
                onChange={(e) => this.userTyping("passwordConfirmation", e)}
              ></Input>
            </FormControl>
            <Button
              type="submit"
              className={classes.submit}
              fullWidth
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </form>
          {this.state.signupError ? (
            <Typography
              className={classes.errorText}
              component="h5"
              variant="h6"
            >
              {this.state.signupError}
            </Typography>
          ) : null}
          <Typography
            component="h5"
            variant="h6"
            className={classes.hasAccountHeader}
          >
            Already Have an Account
          </Typography>

          <Link to="/login" className={classes.logInLink}>
            Log In
          </Link>
        </Paper>
      </main>
    );
  }
  userTyping = (type, e) => {
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;

      case "password":
        this.setState({ password: e.target.value });
        break;

      case "passwordConfirmation":
        this.setState({ passwordConfirmation: e.target.value });
        break;
      default:
        break;
    }
  };
  formIsValid = () => this.state.password === this.state.passwordConfirmation;
  submitSignup = (e) => {
    e.preventDefault();
    if (!this.formIsValid()) {
      this.setState({ signupError: "Passwords do not match!" });
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        (authRes) => {
          const userObj = {
            email: authRes.user.email,
          };
          console.log(authRes);
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.email)
            .set(userObj)
            .then(
              () => {
                this.props.history.push("/dashboard");
              },
              (dbError) => {
                console.log(dbError);
                this.setState({ signupError: "Failed to add user!" });
              }
            );
        },
        (authError) => {
          console.log(authError);
          this.setState({ signupError: "Failed to add user!" });
        }
      );
  };
}
export default withStyles(styles)(Signup);
