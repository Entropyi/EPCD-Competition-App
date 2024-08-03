import styles from "./footer.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";

export default function Footer() {
    const translations = useTranslations("HomePage");

    return (
        <>
            <div className={styles.footer}>
                <div className={styles.innerfooter}>
                    <Image
                        src={"/footer_RCJY_logo.png"}
                        alt={"footer_RCJY_logo"}
                        width={160.14}
                        height={89.7}
                    ></Image>
                    <Image
                        src={"/footer_vision_logo.png"}
                        alt={"footer_vision_logo"}
                        width={65}
                        height={43.33}
                    ></Image>
                </div>
                <div className={styles.outerfooter}>
                    <p>{translations('rights')}</p>
                </div>
            </div>
        </>
    )
}
