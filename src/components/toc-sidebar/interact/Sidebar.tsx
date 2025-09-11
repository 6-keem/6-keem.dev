import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

const SidebarContent = () => {
	return (
		<aside className="not-prose absolute -top-[200px] -left-[100px] -mb-[120px] hidden h-[calc(100%+150px)] xl:block">
			<div className="sticky bottom-0 top-[200px] z-10 mr-[5rem] mt-[200px]">
				<div className="flex-col flex items-center justify-center rounded-full bg-black">
					<Button className="m-3 mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white hover:border-1 border-zinc-500">
						<Heart />
					</Button>
					<Button className="m-3 mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-white">
						<Share2 />
					</Button>
				</div>
			</div>
		</aside>
	);
};

export default SidebarContent;
