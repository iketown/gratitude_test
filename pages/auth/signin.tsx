import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useEffect } from "react";
import { Field, Form } from "react-final-form";
import Copyright from "~/components/Copyright";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { useDateNav } from "~/hooks/useDateNav";
import { useToast } from "~/hooks/useToast";

interface FormValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const { loginEmailPassword } = useAuthCtx();
  const { toast } = useToast();
  const { goToToday } = useDateNav();

  const onSubmit = async (values: FormValues) => {
    const { email, password } = values;
    try {
      const { user } = await loginEmailPassword(email, password);

      console.log("signed in", user);
      toast(`${user.email} signed in`, "success");
      setTimeout(goToToday, 100);
    } catch (error) {
      //@ts-ignore
      switch (error?.code) {
        case "auth/wrong-password": {
          return { password: "wrong password" };
        }
        case "auth/user-not-found": {
          return {
            email: (
              <span>
                user not found. did you already{" "}
                <NextLink href="/auth/signup">
                  <Link sx={{ cursor: "pointer" }}>SIGN UP</Link>
                </NextLink>{" "}
                ?
              </span>
            ),
          };
        }
      }
      console.log("sign in error", error);
    }
  };
  return (
    <div>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => {
          return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Field name="email">
                    {({ input, meta }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        error={meta.touched && (meta.error || meta.submitError)}
                        helperText={
                          (meta.error || meta.submitError) &&
                          meta.touched &&
                          (meta.error || meta.submitError)
                        }
                        {...input}
                      />
                    )}
                  </Field>
                  <Field name="password">
                    {({ input, meta }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={meta.touched && (meta.error || meta.submitError)}
                        helperText={
                          (meta.error || meta.submitError) &&
                          meta.touched &&
                          (meta.error || meta.submitError)
                        }
                        {...input}
                      />
                    )}
                  </Field>
                  {/* <Field name="remember">
                    {({ input }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={!!input.value}
                            onChange={(e, chk) => input.onChange(chk)}
                          />
                        }
                        label="Remember me"
                      />
                    )}
                  </Field> */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link
                        onClick={() => toast("tuff crap mofo", "error")}
                        href="#"
                        variant="body2"
                      >
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <NextLink href="/auth/signup">
                        <div>
                          Don't have an account?{" "}
                          <Link sx={{ cursor: "pointer" }}>Sign Up</Link>
                        </div>
                      </NextLink>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
          );
        }}
      </Form>
    </div>
  );
}
