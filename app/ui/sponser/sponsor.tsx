"use client"
import styles from "@/app/ui/sponser/sponsor.module.css";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";


export default function Sponsor() {
    const translations = useTranslations("HomePage");
    const stripeTranslations = useTranslations("stripe");

    return (
        <div className={styles.root}>

            <div className={styles.introTitleRootContainer}>
                <div className={styles.introTitleContainer}>
                    <div className={styles.detailsSvgContainer}>
                        <Image
                            src={"/infospons.svg"}
                            alt={"sponsors"}
                            width={20}
                            height={20}
                            className={styles.detailsTitleSvg}
                            draggable={false}
                        />
                    </div>
                    <p className={styles.detailsTitleText}>{translations("CompetitionOrganizers")}</p>
                </div>
            </div>

            <div className={styles.sponsorRootContainer}>

                <div className={styles.sponsorContainer}>
                    <div className={styles.rcLogoContainer}>
                        <Image alt={"Rcyc logo"} src={"/RCJY Vertical Lockup.svg"}
                               className={styles.rcycLogoOrg} width={150} height={120}></Image>
                        <div className={styles.orgiTextContainer}>
                            <p className={styles.orgiText}>{translations("Organizer")}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.prizeRootContainer}>
                    <div className={styles.prizeContainer}>
                        <div className={styles.stripeEffectContainer}>
                            <div className={styles.squareContainer}>
                                <p className={`${styles.squareText} ${styles.textSepreator}`}>{stripeTranslations("startsAt")}</p>
                                <p className={styles.squareText}>{stripeTranslations("endsAt")}</p>
                            </div>
                            <div className={styles.sideTextContianer}>
                                <div className={styles.prizeTextContianer}>
                                    <p className={styles.prizeText}>{stripeTranslations("prizeAmount")}</p>
                                    <p className={styles.currencyText}>{stripeTranslations("currency")}</p>
                                </div>
                                <div className={styles.subTextContianer}>
                                    <p className={styles.subText}>{stripeTranslations("prizeSubText")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}