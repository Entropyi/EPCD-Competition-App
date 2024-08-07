"use client"
import styles from "@/app/ui/sponser/sponsor.module.css";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";


export default function Sponsor() {
    const translations = useTranslations("HomePage");

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
                                <p className={styles.squareText}>The competition is due by 15 September</p>
                            </div>
                            <div className={styles.sideTextContianer}>
                                <div className={styles.prizeTextContianer}>
                                    <p className={styles.prizeText}>15 thousand</p>
                                    <p className={styles.currencyText}>Saudi Riyal</p>
                                </div>
                                <div className={styles.subTextContianer}>
                                    <p className={styles.subText}>Total competition prizes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}