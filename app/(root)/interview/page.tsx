import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col gap-8">
      <h3>Interview generation</h3>
      <Agent
        userName={user?.name ?? "Guest"}
        userId={user?.id}
        type="generate"
      />
    </div>
  );
};

export default page;
