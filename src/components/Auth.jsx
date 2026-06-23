import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import Dashboard from "../pages/Dashboard";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function signUp() {
    setErrorMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    } else {
      alert("Signup successful");

      setEmail("");
      setPassword("");
    }
  }

  async function signIn() {
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    } else {
      alert("Login successful");

      setEmail("");
      setPassword("");
    }
  }

  async function demoSignIn() {
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_DEMO_EMAIL,
      password: import.meta.env.VITE_DEMO_PASSWORD,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    alert("Logged in as Demo User");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (user) {
    return <Dashboard user={user} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <>
          <h2 style={{ fontSize: "35px" }}>Inventory System</h2>
          <p style={{ textAlign: "center", color: "#666" }}>
            Manage your inventory efficiently
          </p>
        </>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="auth-buttons">
          {/* <button className="signup-btn" onClick={signUp}>
            Sign Up
          </button> */}

          <button className="login-btn" onClick={signIn}>
            Login
          </button>

          <button className="demo-btn" onClick={demoSignIn}>
            Login as Demo User
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
            marginTop: "10px",
          }}
        >
          Explore the system instantly using a pre-configured demo account.
        </p>
      </div>
    </div>
  );
}

export default Auth;
