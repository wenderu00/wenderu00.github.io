"use client";

import { useEffect } from "react";
import { contact } from "./content";

export function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      `%c MW %c Curioso? Fala comigo: ${contact.email}`,
      "background:#ECE41F;color:#000;font-weight:800;font-size:16px;padding:4px 8px",
      "color:inherit;font-size:13px",
    );
  }, []);

  return null;
}
