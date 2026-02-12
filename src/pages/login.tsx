import { useEffect, useState } from "react"
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    mode?: "login" | "signup"
}

function Login({ mode }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isLogin = mode === "login"
    const navigate = useNavigate();

    useEffect(() => {
        document.title = isLogin ? "Login - Image Galery" : "Sign Up - Image Galery"
    }, [isLogin])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        let response: any;

        if (isLogin) {
            response = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            await navigate('/pictures');
        } else {
            response = await supabase.auth.signUp({
                email,
                password,
            });
        }

        console.log(response);
        cleanForm();
    }

    function cleanForm() {
        setEmail("");
        setPassword("");
    }

    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="shadow-xl px-10 py-15 rounded-md w-[60%] max-w-200 flex flex-col gap-[5vh]">
                <h1 className="font-bold text-2xl text-center">
                    {isLogin ? "Log in to your account" : "Sign up for an account"}
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-b text-sm w-full p-3 focus:rounded-md mb-4 outline-none focus:ring-1 focus:ring-(--text-color) focus:border-transparent transition-all"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-b text-sm w-full p-3 focus:rounded-md mb-4 outline-none focus:ring-1 focus:ring-(--text-color) focus:border-transparent transition-all" />
                    <button type="submit" className="font-bold cursor-pointer hover:bg-(--hover-primary-color) w-full bg-(--primary-color) text-white p-3 rounded-md">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login