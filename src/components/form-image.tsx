import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { Session } from "@supabase/supabase-js";
import { X } from "lucide-react";
import { useImageService } from "../context/image-context";

interface AddImageProps {
    session: Session | null;
}

function FormImage({ session }: AddImageProps) {
    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");

    const {
        editingImage,
        showMenu,
        setShowMenu,
        setEditingImage,
        setIsEditing,
        editImage
    } = useImageService();

    useEffect(() => {
        if (editingImage) {
            setTitle(editingImage.title);
        } else {
            // si es agregar, solo se limpia el form
            setTitle("");
            setImage(null);
        }
    }, [editingImage]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // editar titulo
        if (editingImage) {
            await editImage({ ...editingImage, title });
            cleanForm();
            return;
        }

        // subir imagen
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

        // hasta acá lo ejecuto algo bien
        cleanForm();
        setShowMenu(false);
    }

    function cleanForm() {
        setTitle("");
        setImage(null);
        setShowMenu(false);
        setEditingImage(null);
        setIsEditing(false);
    }

    return (<>
        {showMenu && (
            <>
                <div className="bg-(--bg-color)/95 fixed w-screen h-screen z-2 top-0" onClick={() => setShowMenu(false)}></div>
                <div className="fixed shadow-xl px-10 py-15 rounded-md w-[60%] max-w-200 flex flex-col gap-[5vh] z-3 bg-(--bg-color) top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex justify-between items-center">
                        <h1 className="flex-1 font-bold text-2xl text-center">
                            {editingImage ? "Edit Image" : "Add a New Image"}
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
                        {!editingImage && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                className="font-bold cursor-pointer text-sm w-full p-3 focus:rounded-md mb-4 outline-none transition-all rounded-lg hover:border-(--hover-primary-color) border border-(--text-color)/80"
                            />
                        )}
                        <button type="submit" className="font-bold cursor-pointer hover:bg-(--hover-primary-color) w-full bg-(--primary-color) text-white p-3 rounded-md">
                            {editingImage ? "Update" : "Upload"}
                        </button>
                    </form>
                </div>
            </>
        )}
    </>
    )
}
export default FormImage