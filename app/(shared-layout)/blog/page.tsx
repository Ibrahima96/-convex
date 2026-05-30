"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
const page = () => {
  const tasks = useQuery(api.tasks.get);
  return (
    <main className="flex min-h-screen  items-center justify-between ">
      {tasks?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </main>
  );
};

export default page;
