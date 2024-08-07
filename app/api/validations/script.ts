import * as v from "valibot";
import {useTranslations} from "next-intl";

const serverSideErrors = useTranslations("serverSideErrors");

const FormSchema = v.object({
    fullName: v.pipe(
        v.string(`${serverSideErrors("NameType")}`),
        v.nonEmpty(`${serverSideErrors("nameEmpty")}`),
    ),

    email: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.email(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
    ),

    age: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
        v.maxLength(3, `${serverSideErrors("ss")}`),
        v.minLength(1, `${serverSideErrors("ss")}`)
    )

    , phoneNumber: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
        v.maxLength(10, `${serverSideErrors("ss")}`),
        v.minLength(10, `${serverSideErrors("ss")}`)
    )

    , imageUrl: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
    )

    , photoTitle: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
    )

    , comment: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
    )

    , photoLocation: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
    )

    , photoPurpose: v.pipe(
        v.string(`${serverSideErrors("emailType")}`),
        v.nonEmpty(`${serverSideErrors("emailType")}`),
    )
})

export default FormSchema;