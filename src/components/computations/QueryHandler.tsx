"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function QueryHandler() {
    const searchParams = useSearchParams();
    const [jsonData, setJsonData] = useState(null);

    return null;
}
