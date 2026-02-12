import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRealtimeTable } from "../hooks/use-realtime-table";
import ImageCard from "./image-card";
import FormImage from "../components/form-image";

interface PicturesProps {
    session: Session | null
}

interface Image {
    id: number;
    title: string;
    url: string;
    user?: {
        email: string;
    }
}

function Pictures({ session }: PicturesProps) {
    const [showMenu, setShowMenu] = useState(false);
    const { data: images, loading } = useRealtimeTable<Image>('image', !!session, '*, user(email)');

    if (loading) return <div className="flex justify-center mt-20">Loading gallery...</div>;

    return (
        <>
            {showMenu && (
                <>
                    <FormImage session={session} setShowMenu={setShowMenu}></FormImage>
                </>
            )}

            <main className="bg-amber-200/0 w-full flex h-full mt-15 py-5 flex-col gap-[2vh]">
                <header className="flex justify-between items-center w-full">
                    <h2 className="font-bold text-2xl">
                        Gallery Pictures ({images.length})
                    </h2>
                    <button className="cursor-pointer hover:bg-(--hover-primary-color) bg-(--primary-color) px-3 py-2 rounded-md font-bold transition-all" onClick={() => setShowMenu(true)}>
                        Add Image
                    </button>
                </header>
                <hr />
                <section className="columns-2 md:columns-3 lg:columns-5 space-y-4 gap-4">
                    {images.map((img) => (
                        <ImageCard img={img} key={img.id} session={session} />
                    ))}
                </section>
            </main>
        </>
    );
}

export default Pictures;