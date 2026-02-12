import { images } from "../seeds/images";
const mainImg = "https://images.unsplash.com/photo-1770105328550-b0e90d770c17?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

function Header() {
    return (
        <>
            <main className="flex flex-col justify-center items-center gap-[5vh] w-[80vw]">
                <section className="flex justify-center items-center gap-5 h-[80vh]">
                    <h1 className="text-center font-bold text-4xl w-[50%] leading-normal">
                        Explore the world through stunning images. Welcome to our image gallery, where every picture tells a story.
                    </h1>
                </section>
                <img src={mainImg} alt="" className="object-cover w-full h-[60vh]" />
                <section className="flex items-center w-full h-[15vh] rounded-md">
                    <h2 className="flex items-center gap-4 font-bold text-2xl w-full after:content-[''] after:flex-1 after:h-px before:bg-gray-300 before:content-[''] before:flex-1 before:h-px after:bg-gray-300">
                        All in one place.
                    </h2>
                </section>
                <section className="grid grid-cols-10 gap-2 w-full h-[90vh]">
                    <div className="col-span-4 bg-white h-[40vh]">
                        <img src={images[0]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-2 h-[40vh]">
                        <img src={images[1]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-4 h-[40vh]">
                        <img src={images[2]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-2 h-[40vh]">
                        <img src={images[3]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-3 h-[40vh]">
                        <img src={images[4]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-5  h-[40vh]">
                        <img src={images[5]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-3  h-[40vh]">
                        <img src={images[6]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-5  h-[40vh]">
                        <img src={images[7]} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="col-span-2  h-[40vh]">
                        <img src={images[8]} alt="" className="object-cover h-full w-full" />
                    </div>
                </section>
            </main>
        </>
    )
}

export default Header
