"use client"
import styles from "./success.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {useCookies} from "next-client-cookies";
import { RotatingLines } from "react-loader-spinner";


export default function Footer() {
    const successTranslation = useTranslations("SuccessPage");
    const cookieStore = useCookies();

    return (
        <>
            <div className={styles.successContainer}>
                <div className={styles.successSubContainer}>
                    <div className={styles.successImageContainer}>
                        <Image
                            src={"/success.svg"}
                            alt={"Success Logo"}
                            width={120}
                            height={120}
                            className={styles.langSvg}
                        />
                    </div>
                    <div className={styles.successTextContainer}>
                        <h3 className={styles.formTitleText}>{successTranslation("titleEmail")}</h3>
                        <p className={styles.formSuccessLabel}>{successTranslation("subTextEmail")}</p>
                    </div>
                </div>
            </div>


        </>
    )
}
