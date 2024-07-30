import styles from "@/app/ui/article/article.module.css";
import Image from "next/image";
import {useTranslations} from 'next-intl';

export default function Article() {
    const translations = useTranslations("HomePage");

    return (
        <>
            <div
                className={styles.headerArticleSuperContainer}>
                <div className={styles.headerArticle}>
                    <div className={styles.headerArticleContainer}>
                        <div className={styles.card}>
                            <h4 className={styles.day}>{translations('day')}</h4>
                            <h4 className={styles.month}>{translations('month')}</h4>
                        </div>

                        <div className={styles.articleTitleConatiner}>
                            <h3 className={styles.title}>{translations('title')}</h3>
                        </div>
                    </div>

                    <Image
                        src={"/20220109-025.jpg"}
                        alt={"location"}
                        width={500}
                        height={275}
                        className={styles.headerArticleImage}
                    />


                    <div className={styles.dateContainer}>

                        <div className={styles.dateSvgContainer}>
                            <Image
                                src={"/calendar-days-svgrepo-com.svg"}
                                alt={"date"}
                                width={50}
                                height={50}
                                className={styles.dateSvg}
                            />
                        </div>

                        <div className={styles.dateTextContainer}>
                            <div className={styles.dateFrom}>
                                <p dir="rtl" lang="ar" className={styles.from}>{translations('from')}</p>
                                <p dir="rtl" lang="ar">{translations('starting')} </p>
                            </div>
                            <div className={styles.dateTo}>
                                <p dir="rtl" lang="ar" className={styles.to}>{translations('to')}</p>
                                <p dir="rtl" lang="ar"> {translations('ending')} </p>
                            </div>
                        </div>


                    </div>

                    <div className={styles.location}>
                        <div className={styles.cityInfoContainer}>
                            <div className={styles.citySvgConatiner}>
                                <Image
                                    src={"/city-svgrepo-com.svg"}
                                    alt={"location"}
                                    width={20}
                                    height={20}
                                    className={styles.citySvg}
                                />
                            </div>
                            <div>
                                <p className={styles.cityTitleText}>{translations('citiesCoveredTitle')}</p>
                            </div>

                        </div>
                        <div>
                            <p className={styles.cityNameText}>{translations('city')}</p>
                        </div>

                    </div>
                </div>


            </div>
        </>
    )
}