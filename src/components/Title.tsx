import React from "react";

interface TitleProps {
    title: string;
}

export function Title({ title }: TitleProps) {
    return (
        <div className="flex flex-col items-center">
            <h1 className="p-0 m-0 mt-2">{title}</h1>
        </div>
    );
}