type ProgressBarProp = {
    progress: string;
};
export const ProgressBar = ({ progress }: ProgressBarProp) => {
    return (
        <div className="w-full fixed top-0 z-40">
            <div
                className="h-1 bg-black dark:bg-white"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};
