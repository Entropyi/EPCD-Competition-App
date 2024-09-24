"use client"

import styles from "./form.module.css";
import {useTranslations} from "next-intl";
import {useForm, SubmitHandler} from "react-hook-form"
import Image from "next/image";

import React, {useState} from "react";
import Uppy from "@uppy/core"
import Arabic from "@uppy/locales/lib/ar_SA";
import English from "@uppy/locales/lib/en_US";
import {Dashboard, useUppyState} from "@uppy/react"
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.css"
import "@uppy/dashboard/dist/style.css"
import "@uppy/drag-drop/dist/style.css"
import "@uppy/file-input/dist/style.css"
import "@uppy/progress-bar/dist/style.css"
import {useRouter} from "next/navigation";
import {useLocale} from "next-intl";
import {useSession} from "next-auth/react";
import Validation from "@/app/[locale]/verification/page"

function createUppy(locale: any, userEmail: string) {
    return new Uppy({
        locale: locale,
        restrictions: {
            maxNumberOfFiles: 4,
            allowedFileTypes: ["image/png", "image/jpeg", "image/jpe"],
            maxTotalFileSize: 4 * 1024 * 1024 * 1024,
        },
        autoProceed: false,
    })
        .use(Tus, {
            endpoint: "http://127.0.0.1:1080",
            chunkSize: 1024 * 1024,
            metadata: {
                email: userEmail,
            },
        })

}

function getCurrentLocale() {
    if (useLocale() == "ar") {
        return Arabic;
    } else {
        return English;
    }
}

export default function Form() {

    const formTranslations = useTranslations("FormPage");
    const errorTranslation = useTranslations("formErrorMessages");
    const [popUpDisplay, setPopUpDisplay] = useState<string>("none");
    const [ErrorDisplay, setErrorDisplay] = useState<string>("none");
    const [ErrorValue, setErrorValue] = useState<string>();

    const router = useRouter();
    const locale = useLocale();
    const session = useSession();
    const userEmail = session.data?.user?.email;

    const [uppy] = React.useState(createUppy(getCurrentLocale(), "jehad503@gmail.com"))
    const fileCount = useUppyState(
        uppy,
        (state) => Object.keys(state.files).length,
    )

    type Inputs = {
        fullName: string,
        email: string,
        age: number,
        phoneNumber: string,
        photoTitle: string,
        comments: string,
        photoLocation: string,
        photoPurpose: string,
        termsAgreement: boolean
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const userData = new FormData();
        userData.set("email", session.data?.user?.email as string);
        userData.set("number", data.phoneNumber);

        const userStatusResponse = await fetch(`/api/validations`, {
            method: "POST",
            body: userData,
        })

        const userStatus = await userStatusResponse.json();


        if (fileCount < 1) {
            setErrorDisplay("flex");
            setErrorValue(errorTranslation("imageRequired"));
            window.scrollTo({top: 0, behavior: "smooth"});

        } else {

            uppy.setMeta({userId: userEmail})

            uppy.on("complete", async (result) => {

                if (userStatus.message == "user is new") {
                    const form = new FormData();

                    form.append("fullName", data.fullName)
                    form.append("email", session.data?.user?.email as string)
                    form.append("age", data.age.toString())
                    form.append("phoneNumber", data.phoneNumber)
                    form.append("photoTitle", data.photoTitle)
                    form.append("comments", data.comments)
                    form.append("photoLocation", data.photoLocation)
                    form.append("photoPurpose", data.photoPurpose)


                    const response = await fetch("../api", {
                        method: "POST",
                        body: form,
                    })

                    if (response.ok) {
                        router.replace(`/${locale}/form-success`);
                    } else {
                        setErrorDisplay("flex");
                        const data = await response.json();
                        setErrorValue(data.msg);
                        window.scrollTo({top: 0, behavior: "smooth"});


                    }
                } else {
                    setErrorDisplay("flex");
                    setErrorValue(errorTranslation("duplicate"));
                    window.scrollTo({top: 0, behavior: "smooth"});

                }
            });

            if (userStatus.message == "user is new") {
                await uppy.upload();
            } else {
                setErrorDisplay("flex");
                setErrorValue(errorTranslation("duplicate"));
                window.scrollTo({top: 0, behavior: "smooth"});
            }

        }
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

    let email = "";

    if (typeof session.data?.user?.email === "string") {
        email = session.data?.user?.email;
    } else {
        return <Validation/>
    }

    return (
        <>
            <div className={styles.formSuperContainer}>
                <div className={styles.formContainer}>
                    <div className={styles.formElementsContainer}>
                        <form className={styles.formElements} onSubmit={handleSubmit(onSubmit)} method={"POST"}>
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
                                <div className={styles.formTitleText}>{formTranslations("title")}</div>
                            </div>

                            <div className={styles.formSubElements}>
                                <label className={styles.formLabel}
                                       htmlFor="">{formTranslations("FullName")} </label>
                                <input className={changeInputStyleWhenError("fullName")} type="text"
                                       id="full-name" {...register("fullName",
                                    {
                                        required: `${errorTranslation("fullNameRequired")}`
                                    })}
                                       aria-invalid={errors.fullName ? "true" : "false"}
                                />
                                {errors.fullName && <p role="alert"
                                                       className={styles.formInlineErrorText}>{errors.fullName.message}</p>}


                                <div className={styles.formGroupOne}>

                                    <div className={styles.emailConatiner}>
                                        <label className={styles.formLabel}
                                               htmlFor="">{formTranslations("Email")} </label>
                                        <input className={changeInputStyleWhenError("email")} type="text" value={email}
                                               disabled={true} readOnly={true} id="email"/>
                                        {errors.email && <p role="alert"
                                                            className={styles.formInlineErrorText}>{errors.email.message}</p>}
                                    </div>

                                    <div className={styles.ageConatiner}>
                                        <label className={styles.formLabel}
                                               htmlFor="">{formTranslations("Age")}</label>
                                        <input className={styles.formInput} type="text"
                                               id="age" {...register("age")}/>
                                        {errors.age && <p role="alert"
                                                          className={styles.formInlineErrorText}>{errors.age.message}</p>}
                                    </div>

                                </div>

                                <div className={styles.formGroups}>
                                    <label className={styles.formLabel}
                                           htmlFor="">{formTranslations("PhoneNumber")}</label>
                                    <input className={changeInputStyleWhenError("phoneNumber")} type="text"
                                           id="phone-number" {...register("phoneNumber", {
                                        required: `${errorTranslation("phoneNumberRequired")}`,
                                        minLength: {
                                            value: 10,
                                            message: `${errorTranslation("phoneNumberLessThanMin")}`,
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: `${errorTranslation("phoneNumberLargerThanMax")}`,
                                        },
                                        pattern: {
                                            value: /^(05)[0-9]{8}$/,
                                            message: `${errorTranslation("phoneNumberInvalid")}`,
                                        }
                                    })}/>
                                    {errors.phoneNumber && <p role="alert"
                                                              className={styles.formInlineErrorText}>{errors.phoneNumber.message}</p>}
                                </div>

                                <Dashboard uppy={uppy} hideUploadButton={true}/>

                                <div className={styles.formGroups}>
                                    <label className={styles.formLabel}
                                           htmlFor="">{formTranslations("PhotoTitle")}</label>
                                    <input className={styles.formInput} type="text"
                                           id="photo-title" {...register("photoTitle")}/>
                                </div>

                                <div className={styles.formGroups}>
                                    <label className={styles.formLabel}
                                           htmlFor="">{formTranslations("Comments")}</label>
                                    <textarea className={styles.formInput} id="comments" {...register("comments")}/>
                                </div>

                                <div className={styles.formGroups}>
                                    <label className={styles.formLabel}
                                           htmlFor="">{formTranslations("PhotoLocation")}</label>
                                    <label className={styles.formSubLabel}
                                           htmlFor="">{formTranslations("PhotoLocationRequirements")}</label>

                                    <input className={changeInputStyleWhenError("photoLocation")} type="text"
                                           id="photo-location" {...register("photoLocation",
                                        {
                                            required: `${errorTranslation("locationRequired")}`,
                                            pattern: {
                                                value: /^(https:\/\/)?(www\.)?(maps\.app\.goo\.gl\/[a-zA-Z0-9_-]+)(\?[a-zA-Z0-9_=&#]*)?$/,
                                                message: `${errorTranslation("locationInvalid")}`,
                                            }
                                        })}
                                    />
                                    {errors.photoLocation && <p role="alert"
                                                                className={styles.formInlineErrorText}>{errors.photoLocation.message}</p>}

                                </div>

                                <div className={styles.formGroups}>
                                    <label className={styles.formLabel}
                                           htmlFor="">{formTranslations("Photo Purpose")}</label>
                                    <input className={styles.formInput} type="text" id="photo-purpose"
                                           {...register("photoPurpose")}/>
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