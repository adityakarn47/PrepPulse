import AuthForm from "@/components/AuthForm";
import { FormType } from "@/constants";

const page = () => {
  return <AuthForm type={FormType.SIGNUP} />;
};

export default page;
