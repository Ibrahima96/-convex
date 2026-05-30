"use server"

import { query } from "@/convex/_generated/server";

export const myConstantString = query({
  args: {},
  handler: () => {
    return "My never changing string";
  },
});