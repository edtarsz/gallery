import type { Session } from "@supabase/supabase-js";
import { ImageProvider } from "../context/image-context";
import PicturesContent from "../components/pictures-content";

interface PicturesProps {
    session: Session | null
}

function Pictures({ session }: PicturesProps) {
    return (
        <ImageProvider>
            <PicturesContent session={session} />
        </ImageProvider>
    );
}

export default Pictures;