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

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      loginError: "",
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} onSubmit={(e) => this.submitLogin(e)}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="email">Enter Your Email</InputLabel>
              <Input
                type="email"
                autocomplete="email"
                id="email"
                autoFocus
                onChange={(e) => this.userTyping("email", e)}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="password">Enter Your Password</InputLabel>
              <Input
                type="password"
                autocomplete="password"
                id="password"
                onChange={(e) => this.userTyping("password", e)}
              ></Input>
            </FormControl>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.submit}
              fullWidth
            >
              Log In
            </Button>
          </form>
          <br />
          {this.state.loginError ? (
            <Typography component="h5" variant="h6">
              Incorrent Login Credentials
            </Typography>
          ) : null}
          <Typography
            className={classes.noAccountHeader}
            component="h5"
            variant="h6"
          >
            Don't have an account ?
          </Typography>
          <Link to="/signup" className={classes.signUpLink}>
            Sign Up
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

      default:
        break;
    }
  };

  submitLogin = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        () => {
          this.props.history.push("/dashboard");
        },
        (error) => {
          this.setState({ loginError: "Server Error" });
          console.log(error);
        }
      );
  };
}
export default withStyles(styles)(Login);
