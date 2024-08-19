"use client"

import {useEffect, useState} from "react";
import Header from "@/app/ui/header/Header";
import Footer from "@/app/ui/footer/Footer";
import Link from "next/link";


export default function EmailTemplate({fullName, verificationToken}) {
    const [link, setLink] = useState("");

    useEffect(() => {
        setLink(window.location.origin)
    });


    return (
        <>
            <h1>Welcome {fullName}</h1>
            <Link
                href={`${link}/api/auth/verify-email?token=${verificationToken}`}
            >
                <button>Click Here</button>
            </Link>
        </>
    );
}
