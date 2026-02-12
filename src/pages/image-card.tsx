import type { Session } from "@supabase/supabase-js";
import { Trash, Pen } from "lucide-react";
import { useImageService } from "../context/image-context";

interface ImageItem {
    id: number;
    title: string;
    url: string;
    user?: {
        email: string;
    }
}

interface ImageProps {
    img: ImageItem;
    session?: Session | null;
}

function ImageCard({ img, session }: ImageProps) {
    const { deleteImage, setIsEditing, setEditingImage, setShowMenu } = useImageService();

    return (
        <>
            <div key={img.id} className="break-inside-avoid relative group overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <>{img.user?.email === session?.user.email && (
                    <div className="absolute top-3 right-3 z-1 flex gap-1">
                        <div className="flex justify-center items-center cursor-pointer bg-blue-950 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={() => {
                            setEditingImage(img);
                            setIsEditing(true);
                            setShowMenu(true);
                        }
                        }>
                            <Pen size={15} />
                        </div>
                        <div className="flex justify-center items-center cursor-pointer bg-red-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={() => deleteImage(img)} >
                            <Trash size={15} />
                        </div>
                    </div>
                )}
                </>
                <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-auto object-cover duration-500"
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-bold text-xl truncate">{img.title || "Untitled"}</p>
                    <p className="text-white/40 text-xs">
                        {img.user?.email ? img.user.email : "Loading owner..."}
                    </p>
                </div>
            </div>
        </>
    );
}

export default ImageCard;