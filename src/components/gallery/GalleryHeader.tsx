import { Location } from "./Gallery";

const GalleryHeader = ({ location }: { location: Location }) => {
    return (
        <section className="flex flex-col mb-16 items-center justify-center">
            <div>
                <div className="inline-block text-2xl sm:text-4xl font-semibold mb-2 text-primary">
                    The World Through My Eyes
                </div>
            </div>
            <div className="text-xl sm:text-2xl font-thin">{`${location}`}</div>
        </section>
    );
};

export default GalleryHeader;
