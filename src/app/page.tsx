import { Suspense } from "react";
import { Deck } from "@/components/deck/Deck";

export default function Home() {
    return (
        <Suspense fallback={null}>
            <Deck />
        </Suspense>
    );
}
