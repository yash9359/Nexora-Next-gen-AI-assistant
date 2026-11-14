import { SignIn } from "@clerk/nextjs";

export const instant  = false;

export default function Page() {
    return (<SignIn forceRedirectUrl={"/"}/>)
};
