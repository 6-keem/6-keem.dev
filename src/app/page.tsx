import { redirect } from "next/navigation";

export default function Home() {
    redirect("/blog");
}

// import { signIn } from "@/lib/auth";

// export default function SignIn() {
//     return (
//         <form
//             action={async () => {
//                 "use server";
//                 await signIn("github");
//             }}
//         >
//             <button type="submit">Signin with GitHub</button>
//         </form>
//     );
// }
