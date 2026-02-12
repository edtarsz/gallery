import type { Session } from "@supabase/supabase-js"
import { Link, useNavigate } from "react-router"
import { supabase } from "../supabase-client";

interface HeaderProps {
    session: Session | null
}

function Header({ session }: HeaderProps) {
    const navigate = useNavigate();

    async function logOut() {
        await supabase.auth.signOut();
        navigate('/');
    }

    return (
        <>
            <header className="fixed top-0 inset-x-0 mx-auto w-full px-10 py-5 flex justify-between items-center bg-(--bg-color) shadow-lg z-1">
                <strong className="text-lg">
                    <Link to="/">
                        Image Galery
                    </Link>
                </strong>
                <ul className="flex gap-8">
                    {session ?
                        (<>
                            <li className="font-bold text-sm">
                                <button>
                                    {session.user.email}
                                </button>
                            </li>
                            <li className="font-bold text-sm">
                                <button className="cursor-pointer hover:underline">
                                    <Link to="/pictures">
                                        Watch Pictures
                                    </Link>
                                </button>
                            </li>
                            <li className="font-bold text-sm">
                                <button className="cursor-pointer hover:underline" onClick={logOut}>
                                    Logout
                                </button>
                            </li>
                        </>)
                        :
                        (<>
                            <li className="font-bold text-sm">
                                <button className="cursor-pointer hover:underline">
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </button>
                            </li>
                            <li className="font-bold text-sm">
                                <button className="cursor-pointer hover:underline">
                                    <Link to="/signup">
                                        Sign up
                                    </Link>
                                </button>
                            </li>
                        </>)
                    }
                </ul>
            </header>
        </>
    )
}

export default Header
