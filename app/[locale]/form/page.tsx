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
import {useCookies} from "next-client-cookies";

function createUppy(locale: any) {
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
            chunkSize: 1024 * 1024
        });
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
    const cookieStore = useCookies();

    const authorization = cookieStore.get("authorized");

    if (!authorization) {
        router.back();
    }


    const [uppy] = React.useState(createUppy(getCurrentLocale()))
    const fileCount = useUppyState(
        uppy,
        (state) => Object.keys(state.files).length,
    )


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
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        if (fileCount < 1) {
            setErrorDisplay("flex");
            setErrorValue(errorTranslation("imageRequired"));
            window.scrollTo({top: 0, behavior: "smooth"});

        } else {


            const response = await fetch(`../api/validations?email=${data.email}&number=${data.phoneNumber}`, {
                method: "GET",
            })

            const responseData = await response.json();

            if (responseData.message == "user is new") {
                uppy.on("complete", async (result) => {
                    const imageObject = result.successful;
                    const form = new FormData();
                    let imageUrl: string = "";

                    imageObject?.forEach((file) => {
                        imageUrl += file.uploadURL;
                        console.log(`hey ${file.uploadURL}`)
                        imageUrl += ",";
                    })

                    form.append("fullName", data.fullName)
                    form.append("email", data.email)
                    form.append("age", data.age.toString())
                    form.append("phoneNumber", data.phoneNumber.toString())

                    form.append("imageUrl", String(imageUrl));
                    form.append("photoTitle", data.photoTitle)
                    form.append("comments", data.comments)
                    form.append("photoLocation", data.photoLocation)
                    form.append("photoPurpose", data.photoPurpose)


                    const response = await fetch("../api", {
                        method: "POST",
                        body: form,
                    })

                    if (response.ok) {
                        console.log(await response.json())
                        router.replace(`/${locale}/success`);
                    } else {
                        setErrorDisplay("flex");
                        const data = await response.json();
                        setErrorValue(data.msg);
                        window.scrollTo({top: 0, behavior: "smooth"});


                    }

                });
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