"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { isUsernameAvailable } from "@/lib/firebase/users";
import { usernameSchema } from "@/lib/validations/auth";
import { USERNAME_DEBOUNCE_MS } from "@/lib/constants";

export type UsernameState =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken"
  | "error";

export function useUsernameAvailability(username: string) {
  const [state, setState] = useState<UsernameState>("idle");
  const [message, setMessage] = useState<string>("");
  const debounced = useDebounce(username.trim().toLowerCase(), USERNAME_DEBOUNCE_MS);

  useEffect(() => {
    let active = true;

    if (!debounced) {
      setState("idle");
      setMessage("");
      return;
    }

    const parsed = usernameSchema.safeParse(debounced);
    if (!parsed.success) {
      setState("invalid");
      setMessage(parsed.error.issues[0]?.message ?? "Invalid username");
      return;
    }

    setState("checking");
    setMessage("Checking…");

    isUsernameAvailable(debounced)
      .then((ok) => {
        if (!active) return;
        setState(ok ? "available" : "taken");
        setMessage(ok ? "Available" : "Taken");
      })
      .catch(() => {
        if (!active) return;
        setState("error");
        setMessage("Couldn't check right now");
      });

    return () => {
      active = false;
    };
  }, [debounced]);

  return { state, message, isAvailable: state === "available" };
}
