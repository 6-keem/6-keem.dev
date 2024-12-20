import { ArrowUpToLine } from "lucide-react";
import { Button } from "../ui/button";

export const ScrollTop = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0 });
    };
    return (
        <Button variant={"outline"} size={"icon"} onClick={() => scrollToTop()}>
            <ArrowUpToLine size={16} />
        </Button>
    );
};
