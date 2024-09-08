"use client"
import styles from "./success.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {useCookies} from "next-client-cookies";
import { RotatingLines } from "react-loader-spinner";
import {useSession} from "next-auth/react";


export default function Success() {
    const successTranslation = useTranslations("SuccessPage");
    const cookieStore = useCookies();
    const session = useSession();

    if(session){
        const data = new FormData();

        if(typeof session.data?.user?.email === "string"){
            const email = session.data?.user?.email;
            data.append("email",email);
        }
    }

    /*
    const response = await fetch("../api", {
        method: "POST",
    })
*/

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
