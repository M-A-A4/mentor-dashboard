
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_URL = "http://localhost:3001/users";

function getSafeUser(account) {
  if (!account) return null;

  const safeUser = { ...account };
  delete safeUser.password;

  return safeUser;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mentor-demo-session")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("mentor-demo-session", JSON.stringify(user));
    } else {
      localStorage.removeItem("mentor-demo-session");
    }
  }, [user]);

  async function register({ name, email, password }) {
    const response = await fetch(
      `${API_URL}?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error("Could not check existing accounts.");
    }

    const existingUsers = await response.json();

    if (existingUsers.length > 0) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      name,
      email,
      password,
      role: "Workspace Member",
      accountType: "Registered Account",
      memberSince: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };

    const createResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!createResponse.ok) {
      throw new Error("Could not create your account.");
    }

    const createdUser = await createResponse.json();
    const safeUser = getSafeUser(createdUser);

    setUser(safeUser);
    return safeUser;
  }

  async function login(email, password) {
    const response = await fetch(
      `${API_URL}?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error("Could not connect to the server.");
    }

    const users = await response.json();
    const foundUser = users.find((item) => item.password === password);

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }

    const safeUser = getSafeUser(foundUser);

    setUser(safeUser);
    return safeUser;
  }

  async function updateAccount(updates) {
    if (!user?.id) {
      throw new Error("Please sign in again.");
    }

    const response = await fetch(`${API_URL}/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Could not update your account.");
    }

    const updatedUser = await response.json();
    const safeUser = getSafeUser(updatedUser);

    setUser(safeUser);
    return safeUser;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        register,
        login,
        updateAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
