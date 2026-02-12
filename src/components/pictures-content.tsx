import type { Session } from "@supabase/supabase-js";
import { useImageService } from "../context/image-context";
import { useRealtimeTable } from "../hooks/use-realtime-table";
import ImageCard from "../pages/image-card";
import FormImage from "./form-image";

interface Image {
    id: number;
    title: string;
    url: string;
    user?: {
        email: string;
    }
}

interface PicturesProps {
    session: Session | null;
}

function PicturesContent({ session }: PicturesProps) {
    const { setShowMenu, setIsEditing } = useImageService();

    const { data: images, loading } = useRealtimeTable<Image>('image', !!session, '*, user(email)');

    if (loading) return <div className="flex justify-center mt-20">Loading gallery...</div>;

    return (
        <>
            <FormImage session={session} />

            <main className="bg-amber-200/0 w-full flex h-full mt-15 py-5 flex-col gap-[2vh]">
                <header className="flex justify-between items-center w-full">
                    <h2 className="font-bold text-2xl">
                        Gallery Pictures ({images.length})
                    </h2>
                    <button
                        className="cursor-pointer hover:bg-(--hover-primary-color) bg-(--primary-color) px-3 py-2 rounded-md font-bold transition-all"
                        onClick={() => {
                            setShowMenu(true)
                            setIsEditing(false);
                        }
                        }>
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

export default PicturesContent;