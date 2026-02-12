import { createContext, useContext, useState, type ReactNode } from "react";
import { supabase } from "../supabase-client";

interface ImageItem {
    id: number;
    title: string;
    url: string;
    user?: { email: string };
}

interface ImageContextType {
    showMenu: boolean;
    setShowMenu: (show: boolean) => void;

    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;

    editingImage: ImageItem | null;
    setEditingImage: (img: ImageItem | null) => void;

    deleteImage: (img: ImageItem) => Promise<void>;
    editImage: (img: ImageItem) => Promise<void>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: ReactNode }) {
    const [showMenu, setShowMenu] = useState(false);
    const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

    async function deleteImage(img: ImageItem) {
        const pathParts = img.url.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const fullPath = `galery/${fileName}`;

        // borrar de la DB
        const { error: dbError } = await supabase
            .from('image')
            .delete()
            .eq('id', img.id);

        if (dbError) {
            console.error("Error en DB:", dbError);
            return;
        }

        // borrar del storage
        const { error: storageError } = await supabase.storage
            .from('user-images')
            .remove([fullPath]);

        if (storageError) {
            console.error("Error en Storage:", storageError);
        }
    }

    async function editImage(img: ImageItem) {
        const { error } = await supabase
            .from('image')
            .update({ title: img.title })
            .eq('id', img.id);

        if (error) {
            console.error("Error editando imagen:", error);
        } else {
            console.log("Imagen editada con éxito!");
        }
    }

    return (
        <ImageContext.Provider value={{
            showMenu, setShowMenu,
            editingImage, setEditingImage,
            deleteImage, editImage,
            isEditing: !!editingImage, setIsEditing: (isEditing) => {
                if (!isEditing) setEditingImage(null);
            }
        }}>
            {children}
        </ImageContext.Provider>
    );
}

export const useImageService = () => {
    const context = useContext(ImageContext);
    if (!context) throw new Error("useImageService debe usarse dentro de ImageProvider");
    return context;
};