import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/authService";
import storage from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return storage.getUser();
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = storage.getToken();
      const storedUser = storage.getUser();

      /*
       * If there is no token, there is no session to restore.
       */
      if (!token) {
        if (mounted) {
          setUser(storedUser || null);
          setLoading(false);
        }

        return;
      }

      /*
       * Keep the stored user immediately.
       * This prevents the UI from unnecessarily
       * behaving as logged out during refresh.
       */
      if (mounted && storedUser) {
        setUser(storedUser);
      }

      try {
        /*
         * Verify the token with the backend.
         */
        const response = await authService.getMe();

        if (!mounted) {
          return;
        }

        if (
          response?.success &&
          response?.user
        ) {
          /*
           * Backend confirmed the session.
           */
          setUser(response.user);
          storage.setUser(response.user);
        } else {
          /*
           * Token exists but backend did not
           * return a valid user.
           */
          storage.clear();
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Session restore failed:",
          error
        );

        if (!mounted) {
          return;
        }

        /*
         * Only clear the session when the
         * backend rejects the session.
         */
        storage.clear();
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * LOGIN
   */
  const login = async (
    email,
    password
  ) => {
    const response =
      await authService.login({
        email,
        password,
      });

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Login failed"
      );
    }

    storage.setToken(
      response.token
    );

    storage.setUser(
      response.user
    );

    setUser(response.user);

    return response;
  };

  /*
   * REGISTER
   */
  const register = async (
    name,
    email,
    password
  ) => {
    const response =
      await authService.register({
        name,
        email,
        password,
      });

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Registration failed"
      );
    }

    storage.setToken(
      response.token
    );

    storage.setUser(
      response.user
    );

    setUser(response.user);

    return response;
  };

  /*
   * LOGOUT
   */
  const logout = () => {
    storage.clear();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated:
        Boolean(user),
      login,
      register,
      logout,
    }),
    [
      user,
      loading,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}