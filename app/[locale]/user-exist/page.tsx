"use client"
import styles from "./success.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";

export default function Footer() {
    const successTranslation = useTranslations("SuccessPage");

    return (
        <>
            <div className={styles.successContainer}>
                <div className={styles.successSubContainer}>
                    <div className={styles.successImageContainer}>
                        <Image
                            src={"/info.svg"}
                            alt={"Success Logo"}
                            width={120}
                            height={120}
                            className={styles.langSvg}
                        />
                    </div>
                    <div className={styles.successTextContainer}>
                        <h3 className={styles.formTitleText}>{successTranslation("alreadyParticipatedTitle")}</h3>
                        <p className={styles.formSuccessLabel}>{successTranslation("alreadyParticipatedSubText")}</p>
                    </div>
                </div>
            </div>


        </>
    )
}
