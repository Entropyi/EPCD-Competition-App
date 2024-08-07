"use client"

import styles from "./form.module.css";
import {useTranslations} from 'next-intl';
import {useForm, SubmitHandler} from "react-hook-form"
import Image from "next/image";

import React, {useState} from "react";
import Uppy from '@uppy/core'
import Arabic from '@uppy/locales/lib/ar_SA';
import {Dashboard, useUppyState} from '@uppy/react'
import Tus from '@uppy/tus';

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/file-input/dist/style.css'
import '@uppy/progress-bar/dist/style.css'
import {useRouter} from "next/navigation";
import {useLocale} from "next-intl";

function createUppy() {
    return new Uppy({
        locale: Arabic,
        restrictions: {
            maxNumberOfFiles: 4,
            allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpe'],
        },
        autoProceed: false,
    })
        .use(Tus, {endpoint: 'http://127.0.0.1:1080'});
}


export default function Form() {
    const formTranslations = useTranslations("FormPage");
    const errorTranslation = useTranslations("formErrorMessages");

    const router = useRouter();
    const locale = useLocale();

    const [uppy] = React.useState(createUppy)
    const fileCount = useUppyState(
        uppy,
        (state) => Object.keys(state.files).length,
    )
    const totalProgress = useUppyState(uppy, (state) => state.totalProgress)
    const plugins = useUppyState(uppy, (state) => state.plugins)


    const [popUpDisplay, setPopUpDisplay] = useState<string>("none");
    const [ErrorDisplay, setErrorDisplay] = useState<string>("none");

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
/*
        uppy.on("upload-success", (file, response) => {

            if (typeof response.uploadURL === 'string') {

                const imageUrl = response.uploadURL;
                console.log(imageUrl);
                const form = new FormData();

                form.append('fullName', data.fullName)
                form.append('email', data.email)
                form.append('age', data.age.toString())
                form.append('phoneNumber', data.phoneNumber.toString())

                form.append('imageUrl', imageUrl);
                form.append('photoTitle', data.photoTitle)
                form.append('comments', data.comments)
                form.append('photoLocation', data.photoLocation)
                form.append('photoPurpose', data.photoPurpose)

                console.log(form.getAll("imageUrl"))
                router.push(`/${locale}/success`);

            } else {
                console.log("response is not valid");
            }


        })

        /* const form = new FormData();
         const imageArray: File[] = data.image as unknown as File[];

         form.append('fullName', data.fullName)
         form.append('email', data.email)
         form.append('age', data.age.toString())
         form.append('phoneNumber', data.phoneNumber.toString())

         form.append('file', imageArray[0]);

         form.append('photoTitle', data.photoTitle)
         form.append('comments', data.comments)
         form.append('photoLocation', data.photoLocation)
         form.append('photoPurpose', data.photoPurpose)

         try {

             const response = await fetch('../api/upload', {
                 method: 'POST',
                 body: form,
             })

             if (!response.ok) {
                 throw new Error(await response.text())
             } else {

             }
         } catch (e) {
             console.log(e)
         }

        if (!fileCount) {
            setErrorDisplay("flex");
            console.log("error");
            return;
        }
        await uppy.upload();

 */

        setPopUpDisplay("flex");

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
                            <p className={styles.alertText}>{errorTranslation("imageRequired")}</p>
                        </div>

                    </div>
                </div>
                <div className={styles.formContainer}>
                    <div className={styles.formElementsContainer}>
                        <form className={styles.formElements} onSubmit={handleSubmit(onSubmit)} method={"POST"}>

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
                                           id="photo-location" {...register("photoLocation", {required: `${errorTranslation("locationRequired")}`})} />
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