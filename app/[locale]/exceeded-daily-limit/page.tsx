import styles from "./success.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";


export default function Limit() {

    const successTranslation = useTranslations("SuccessPage");

    return (
        <>
            <div className={styles.successContainer}>
                <div className={styles.successSubContainer}>
                    <div className={styles.successImageContainer}>
                        <Image
                            src={"/alert.svg"}
                            alt={"alert svg"}
                            width={120}
                            height={120}
                            className={styles.langSvg}
                        />
                    </div>
                    <div className={styles.successTextContainer}>
                        <h3 className={styles.formTitleText}>{successTranslation("dailyLimitTitle")}</h3>
                        <p className={styles.formSuccessLabel}>{successTranslation("dailyLimitText")}</p>
                    </div>
                </div>
            </div>


        </>
    )
}