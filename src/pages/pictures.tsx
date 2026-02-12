import { useState } from "react";
import { supabase } from "../supabase-client";
import type { Session } from "@supabase/supabase-js";
import { X } from "lucide-react";
import { useRealtimeTable } from "../hooks/use-realtime-table";

interface PicturesProps {
    session: Session | null
}

interface Image {
    id: number;
    title: string;
    url: string;
    created_at: string;
    user?: {
        email: string;
    }
}

function Pictures({ session }: PicturesProps) {
    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const { data: images, loading } = useRealtimeTable<Image>('image', !!session, '*, user(email)');

    if (loading) return <div className="flex justify-center mt-20">Loading gallery...</div>;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (image) {
            const filePath = `galery/${Date.now()}_${image.name}`;

            const { data, error: uploadError } = await supabase.storage
                .from('user-images')
                .upload(filePath, image);

            if (uploadError) {
                console.error('Error subiendo imagen:', uploadError);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('user-images')
                .getPublicUrl(data.path);

            const { error: insertError } = await supabase
                .from('image')
                .insert({
                    url: publicUrl,
                    title,
                    user_id: session?.user.id,
                });

            if (insertError) {
                console.error('Error insertando imagen:', insertError);
            } else {
                console.log('Imagen insertada con éxito!');
            }
        }

        cleanForm();
        setShowMenu(false);
    }



    function cleanForm() {
        setTitle("");
        setImage(null);
    }

    return (
        <>
            {showMenu && (
                <>
                    <div className="bg-(--bg-color)/95 fixed w-screen h-screen z-2 top-0" onClick={() => setShowMenu(false)}></div>
                    <div className="fixed shadow-xl px-10 py-15 rounded-md w-[60%] max-w-200 flex flex-col gap-[5vh] z-3 bg-(--bg-color) top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="flex justify-between items-center">
                            <h1 className="flex-1 font-bold text-2xl text-center">
                                Add a New Image
                            </h1>
                            <span className="cursor-pointer p-3 bg-(--primary-color) hover:bg-(--hover-primary-color) rounded-full aspect-square" onClick={() => setShowMenu(false)}><X size={20} /></span>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border-b text-sm w-full p-3 focus:rounded-md mb-4 outline-none focus:ring-1 focus:ring-(--text-color) focus:border-transparent transition-all" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                className="font-bold cursor-pointer text-sm w-full p-3 focus:rounded-md mb-4 outline-none transition-all rounded-lg hover:border-(--hover-primary-color) border border-(--text-color)/80"
                            />
                            <button type="submit" className="font-bold cursor-pointer hover:bg-(--hover-primary-color) w-full bg-(--primary-color) text-white p-3 rounded-md">
                                Upload
                            </button>
                        </form>
                    </div>
                </>
            )}

            <main className="bg-amber-200/0 w-full flex h-full mt-15 py-5 flex-col gap-[2vh]">
                <header className="flex justify-between items-center w-full">
                    <h2 className="font-bold text-2xl">
                        Pictures Gallery ({images.length})
                    </h2>
                    <button className="cursor-pointer hover:bg-(--hover-primary-color) bg-(--primary-color) px-3 py-2 rounded-md font-bold transition-all" onClick={() => setShowMenu(true)}>
                        Add Image
                    </button>
                </header>
                <hr />
                <section className="columns-2 md:columns-3 lg:columns-5 space-y-4 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="break-inside-avoid relative group overflow-hidden shadow-sm hover:shadow-lg transition-all">
                            <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-auto object-cover duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white font-bold text-xl truncate">{img.title || "Untitled"}</p>
                                <p className="text-white/80 text-xs">
                                    {img.user?.email ? img.user.email : "Loading owner..."}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
}

export default Pictures;