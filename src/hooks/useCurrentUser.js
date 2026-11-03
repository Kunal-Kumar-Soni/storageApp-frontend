import { useEffect, useState } from "react";
import { fetchUser } from "../api/userApi";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchUser().then((data) => active && setUser(data)).catch(() => active && setUser(null)).finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  return { user, isLoading };
}
