"use client"

import styles from "./header.module.css";
import Image from "next/image";
import {usePathname, useRouter} from "@/navigation";
import {useEffect, useState} from 'react';
import {useLocale} from 'next-intl';

export default function Header() {
    const router = useRouter();
    const locale = useLocale();
    const pathName = usePathname();

    const [lang, setLang] = useState<string>("en");
    const [slogan, setSlogan] = useState<string>("");

    useEffect(() => {
        /*if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("Geolocation not supported");
        }

        function success(position: { coords: { latitude: any; longitude: any; }; }) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        }

        function error() {
            console.log("Unable to retrieve your location");
        }
*/
        if (locale === 'ar') {
            setLang("En");
            setSlogan("صنـاعـــــــة وحيـــــــاة")
        } else {
            setLang("ع");
            setSlogan("Industry and Life")
        }
    }, [locale]);
    const langSwitch = () => {
        if (locale === "ar") {
            router.replace(pathName, {locale: 'en'});

        } else {
            router.replace(pathName, {locale: 'ar'});
        }
    }

    const routeHome = () => {
        router.push("/");
    }

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerSubContainer}>
                <div className={styles.headerSloganContainer}>
                    <p className={styles.slogan}>{slogan}</p>
                </div>

                <div
                    className={styles.headerLogoContainer} onClick={routeHome}>
                    <Image
                        src={"/navbar_logo.png"}
                        alt={"RCYCI Logo"}
                        width={154.3}
                        height={45}
                        className={styles.logo}
                    />
                </div>


                <div
                    className={styles.headerLanguagesSwitchSuperContainer}>
                    <div
                        className={styles.headerLanguagesSwitchContainer}
                        onClick={langSwitch}>
                        <p className={styles.englishLangText}>{lang}</p>
                        <Image
                            src={"/lang.svg"}
                            alt={"RCYCI Logo"}
                            width={18.3}
                            height={18}
                            className={styles.langSvg}
                        />
                    </div>
                </div>


            </div>
        </div>
    )
}