"use client"
import styles from "./success.module.css";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import {useSession} from "next-auth/react";
import {useCookies} from "next-client-cookies";
import {useRouter} from "next/navigation";

export default function SuccessPage() {
    const session = useSession();
    const cookies = useCookies();
    const router = useRouter();
    const locale = useLocale();

    const successTranslation = useTranslations("SuccessPage");

    const verifyUser = async () => {

        const data = new FormData();

        if (typeof session.data?.user?.email === "string") {
            const email = session.data?.user?.email;
            data.append("email", email);

            const response = await fetch("../api/validateUser", {
                method: "POST",
                body: data,
            })

            const responseJson = await response.json();
            const cookieValue = cookies.get("newUser");

            if (responseJson.newUser) {
                if (cookieValue == "true" && responseJson.newUser == true) {
                    router.replace(`/${locale}/form`);
                }
            } else {
                router.replace(`/${locale}/user-exist`);
            }

        }

    }

    if (session) {
        verifyUser().then(r =>
            console.log(JSON.stringify("done"))
        );
    }

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
                        <h3 className={styles.formTitleText}>{successTranslation("titleSuccess")}</h3>
                        <p className={styles.formSuccessLabel}>{successTranslation("subTextSuccess")}</p>
                    </div>
                </div>
            </div>


        </>
    )
}