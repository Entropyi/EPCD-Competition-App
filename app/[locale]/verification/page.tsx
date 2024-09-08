"use client"

import styles from "./form.module.css";
import {useTranslations} from 'next-intl';
import {useForm, SubmitHandler} from "react-hook-form"
import Image from "next/image";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useLocale} from "next-intl";
import {useCookies} from 'next-client-cookies';
import Success from "@/app/[locale]/email-sent/page"
import formAction from "@/app/lib/formAction/action";
import {RotatingLines} from "react-loader-spinner";
import { useSession } from "next-auth/react"


export default function Form() {
    const session = useSession();
    if(session) return <Success/>
    console.log(session)


    const formTranslations = useTranslations("FormPage");
    const errorTranslation = useTranslations("formErrorMessages");
    const [popUpDisplay, setPopUpDisplay] = useState<string>("none");
    const [ErrorDisplay, setErrorDisplay] = useState<string>("none");
    const [spinnerDisplay, setSpinnerDisplay] = useState<string>("none");
    const [formElementsDisplay, setFormElementsDisplay] = useState<string>("block");
    const [ErrorValue, setErrorValue] = useState<string>();


    type Inputs = {
        fullName: string,
        email: string,
        age: number,
        phoneNumber: number,
        photoTitle: string,
        comments: string,
        photoLocation: string,
        photoPurpose: string,
        termsAgreement: boolean
    }

    const {
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setSpinnerDisplay("flex");
        setFormElementsDisplay("none");

        await formAction();

    }


    const popUpClose = () => {
        setPopUpDisplay("none");
    }

    const changeInputStyleWhenError = (inputName: string) => {
        if (inputName === "fullName") {
            return errors.fullName ? styles.inputWhileError : styles.formInput;
        } else if (inputName === "email") {
            return errors.email ? styles.inputWhileError : styles.formInput;
        } else if (inputName === "phoneNumber") {
            return errors.phoneNumber ? styles.inputWhileError : styles.formInput;
        } else if (inputName === "photoLocation") {
            return errors.photoLocation ? styles.inputWhileError : styles.formInput;
        }
    }
    return (
        <>
            <div className={styles.formSuperContainer}>
                <div className={styles.formContainer}>
                    <div className={styles.formElementsContainer}>
                        <div className={styles.emailWaitContainer}  style={{display: spinnerDisplay}}>
                            <div className={styles.formTitleText}>{formTranslations("loginWait")}</div>
                            <div className={styles.spinner}>
                                <RotatingLines
                                    strokeColor="grey"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="50"
                                    visible={true}
                                />
                            </div>
                        </div>

                        <form className={styles.formElements} onSubmit={handleSubmit(onSubmit)} method={"POST"}
                              style={{display: formElementsDisplay}}>
                            <div className={styles.alertSuperContainer}>
                                <div className={styles.alertContainer} style={{display: ErrorDisplay}}>
                                    <div className={styles.alertSvgContainer}>
                                        <Image
                                            className={styles.alertSvg}
                                            src={"/alert.svg"}
                                            alt={"error"}
                                            width={30}
                                            height={30}>
                                        </Image>
                                    </div>
                                    <div className={styles.alertTextContainer}>
                                        <p className={styles.alertText}>{ErrorValue}</p>
                                    </div>

                                </div>
                            </div>
                            <div className={styles.formTitleContainer}>
                                <div className={styles.formTitleText}>{formTranslations("loginTitle")}</div>
                            </div>

                            <div className={styles.formSubElements}>
                                <div className={styles.buttonContainer}>

                                    <button type="submit" className={styles.formButtonGoogle}>
                                        <Image
                                            src={"/googleSvg.svg"}
                                            width={30}
                                            height={30}
                                            alt={"google icon"}/>
                                        {formTranslations("authGoogle")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className={styles.popUpDevContainer} style={{display: popUpDisplay}}>
                <div className={styles.closePopUpContainer}>
                    <div className={styles.closePopUp} onClick={popUpClose}>X</div>
                </div>
                <div className={styles.popUpDev__logo}>
                    <Image
                        src={"/corro.svg"}
                        alt={"error"}
                        width={160.14}
                        height={89.7}
                    ></Image>
                </div>
                <div className={styles.popUpDev__text}>
                    <p>{formTranslations("popUpMessage")}</p>
                </div>
            </div>
        </>
    )
}