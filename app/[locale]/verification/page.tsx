"use client"

import styles from "./form.module.css";
import {useLocale, useTranslations} from 'next-intl';
import {useForm, SubmitHandler} from "react-hook-form"
import Image from "next/image";

import {useState} from "react";
import formAction from "@/app/lib/formAction/action";
import {RotatingLines} from "react-loader-spinner";
import {useSession} from "next-auth/react"
import SuccessPage from "@/app/[locale]/success/page";
import Limit from "@/app/[locale]/exceeded-daily-limit/page";
import {useRouter} from "next/navigation";

export default function Validation() {

    const router = useRouter();
    const formTranslations = useTranslations("FormPage");
    const errorTranslation = useTranslations("formErrorMessages");
    const [popUpDisplay, setPopUpDisplay] = useState<string>("none");
    const [ErrorDisplay, setErrorDisplay] = useState<string>("none");
    const [spinnerDisplay, setSpinnerDisplay] = useState<string>("none");
    const [formElementsDisplay, setFormElementsDisplay] = useState<string>("block");
    const [ErrorValue, setErrorValue] = useState<string>();
    const session = useSession();
    const user = session.data?.user?.email;
    const locale = useLocale();

    type Inputs = {
        email: string,
        termsAgreement: boolean
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setSpinnerDisplay("flex");
        setFormElementsDisplay("none");

        try {
            await formAction(data.email);
        } catch (error) {
            router.replace(`/${locale}/exceeded-daily-limit`);
        }
    }


    const popUpClose = () => {
        setPopUpDisplay("none");
    }

    const changeInputStyleWhenError = (inputName: string) => {
        if (inputName === "email") {
            return errors.email ? styles.inputWhileError : styles.formInput;
        }
    }

    if (typeof user === "string") return <SuccessPage/>

    return (
        <>
            <div className={styles.formSuperContainer}>
                <div className={styles.formContainer}>
                    <div className={styles.formElementsContainer}>
                        <div className={styles.emailWaitContainer} style={{display: spinnerDisplay}}>
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

                                <div className={styles.formGroupOne}>

                                    <div className={styles.emailConatiner}>
                                        <label className={styles.formLabel}
                                               htmlFor="">{formTranslations("Email")} </label>
                                        <input className={changeInputStyleWhenError("email")} type="text"
                                               id="email" {...register("email",
                                            {
                                                required: `${errorTranslation("emailRequired")}`,
                                                pattern: {
                                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                    message: `${errorTranslation("emailInvalid")}`,
                                                }
                                            })}/>
                                        {errors.email && <p role="alert"
                                                            className={styles.formInlineErrorText}>{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className={styles.formTermsAgreement}>
                                    <input type="checkbox" className={styles.formCheckBox}
                                           {...register("termsAgreement", {
                                               required: `${errorTranslation("termsAgreementRequired")}`
                                           })}/>
                                    <label
                                        className={styles.formLabel}>{formTranslations("TermsAgreement")} </label>
                                </div>

                                {errors.termsAgreement && <p role="alert"
                                                             className={styles.formInlineErrorText}>{errors.termsAgreement.message}</p>}

                                <div className={styles.buttonContainer}>
                                    <input type="submit" className={styles.formButton}
                                           value={formTranslations("Submit")}/>
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