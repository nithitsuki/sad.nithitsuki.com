import React from "react";

interface TitleProps {
    title: string;
    className?: string;
}

export function Title({ title, className }: TitleProps) {
    return (
        <div id="Heading Title" className="flex flex-col z-0 items-center">
            <h1 className={`p-0 pt-1 z-0 bg-gradient-to-b dark:from-neutral-200 from-gray-500  to-neutral-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl text-center ${className}`}>{title}</h1>
        </div>
    );
}