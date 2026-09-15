import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const CLIENT_ID =
  "1061258886636-khms86es1fbv13sdhcu4un9j50gotk1c.apps.googleusercontent.com";

function OAuthCallback() {
  const navigate = useNavigate();

  function decodeJwtPayload(token) {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  }

  useEffect(() => {
    const authenticate = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log(code, "code");
      if (!code) {
        console.error("Authorization code missing");
        navigate("/login");
        return;
      }

      const codeVerifier = sessionStorage.getItem("code_verifier");

      try {
        const response = await fetch(TOKEN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: CLIENT_ID,
            code,
            code_verifier: codeVerifier,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/oauth/callback",
            client_secret: "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",
          }),
        });

        const data = await response.json();
        if (data.error) {
          console.error("Token exchange failed:", data);
          navigate("/login");
          return;
        }
        const claims = decodeJwtPayload(data.id_token);
        // Store tokens
        sessionStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem("refresh_token", data.refresh_token);
        }
        sessionStorage.setItem(
          "token_expiry",
          String(Date.now() + data.expires_in * 1000),
        );
        sessionStorage.setItem(
          "user_profile",
          JSON.stringify({
            name: claims.name,
            email: claims.email,
            picture: claims.picture,
          }),
        );
        sessionStorage.removeItem("code_verifier");

        navigate("/calendar");
      } catch (err) {
        console.error("Authentication error:", err);
        navigate("/login");
      }
    };

    authenticate();
  }, [navigate]);

  return <h2>Signing you in...</h2>;
}

export default OAuthCallback;
