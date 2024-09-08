import styles from "@/app/ui/unauthorized/unauthorized.module.css";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";


export default function Unauthorized() {
    const translations = useTranslations("HomePage");
    const locale = useLocale();

    return (
        <div className={styles.rootContainer}>
            <div className={styles.container}>
                <div className={styles.unathSvg}>
                    <Image
                        src={"/alerta.svg"}
                        width={90}
                        height={90}
                        alt={"Alert Svg"}
                    />

                </div>
                <div className={styles.unauthTitle}>
                    <h1>401</h1>
                </div>
                <div className={styles.unauthText}>
                    <p>{translations("Unauthorized")}</p>
                </div>
                <div className={styles.unauthButton}>

                </div>
            </div>
        </div>
    )
}