import styles from "@/app/ui/introduction/introduction.module.css";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";


export default function Introduction() {
    const translations = useTranslations("HomePage");

    const locale = useLocale();

    return (
        <div className={styles.introductionRoot}>
            <div className={styles.introductionRootContainer}>
                <div className={styles.detailsTitleContainer}>
                    <div className={styles.detailsSvgContainer}>
                        <Image
                            src={"/align-right-svgrepo-com.svg"}
                            alt={"details"}
                            width={20}
                            height={20}
                            className={styles.detailsTitleSvg}
                            draggable={false}

                        />
                    </div>
                    <p className={styles.detailsTitleText}>{translations('CompDetailsTitle')}</p>
                </div>

                <div className={styles.introTitleContainer}>
                    <div className={styles.detailsSvgContainer}>
                        <Image
                            src={"/shield-exclamation-svgrepo-com.svg"}
                            alt={"details"}
                            width={20}
                            height={20}
                            className={styles.detailsTitleSvg}
                            draggable={false}
                        />
                    </div>
                    <p className={styles.detailsTitleText}>{translations('introductionTitle')}</p>
                </div>
                <p className={styles.introductionText}>{translations('introductionText')}</p>
                <div className={styles.introTitleContainer}>
                    <div className={styles.detailsSvgContainer}>
                        <Image
                            src={"/white-board-svgrepo-com.svg"}
                            alt={"details"}
                            width={20}
                            height={20}
                            className={styles.detailsTitleSvg}
                            draggable={false}
                        />
                    </div>
                    <p className={styles.detailsTitleText}>{translations('CompCategoriesTitle')}</p>
                </div>
                <p className={styles.introductionText}>{translations('CompCategoriesTextMain')}</p>
                <br/>
                <p className={styles.introductionText}>{translations('CompCategoriesTextSub1')}</p>
                <p className={styles.introductionText}>{translations('CompCategoriesTextSub2')}</p>
                <p className={styles.introductionText}>{translations('CompCategoriesTextSub3')}</p>

                <div className={styles.spacing}>
                    <div className={styles.introTitleContainer}>
                        <div className={styles.detailsSvgContainer}>
                            <Image
                                src={"/contract-coverage-svgrepo-com.svg"}
                                alt={"details"}
                                width={20}
                                height={20}
                                className={styles.detailsTitleSvg}
                                draggable={false}
                            />
                        </div>
                        <p className={styles.detailsTitleText}>{translations('TermsAndConditionsTitle')}</p>
                    </div>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText1')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText2')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText3')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText4')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText5')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText6')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText7')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText8')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText9')}</p>
                    <p className={styles.introductionText}>{translations('TermsAndConditionsText10')}</p>
                </div>

                <div className={styles.introTitleContainer}>
                    <div className={styles.detailsSvgContainer}>
                        <Image
                            src={"/click-svgrepo-com.svg"}
                            alt={"details"}
                            width={20}
                            height={20}
                            className={styles.detailsTitleSvg}
                            draggable={false}
                        />
                    </div>
                    <p className={styles.detailsTitleText}>{translations('HowToParticipateTitle')}</p>
                </div>
                <p className={styles.introductionText}>
                    {translations('HowToParticipateText')}<Link href={`/${locale}/form`}>{translations('HowToParticipateTextLink')}</Link>
                </p>
            </div>
        </div>
    )
}