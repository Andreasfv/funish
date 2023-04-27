import { zodResolver } from "@hookform/resolvers/zod";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styled from "styled-components";
import { z } from "zod";
import FormInput from "../../../../components/input/formInput";
import FormNumberInput from "../../../../components/input/formNumberInput";
import FormSelect from "../../../../components/input/formSelect";
import { api } from "../../../../utils/api";
import FormField from "../../components/FormField";
import SubmitButton from "../../components/SubmitButton";
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ErrorSpan = styled.span`
  color: ${(props) => props.theme.colors.red};
  font-size: 0.8rem;
  margin-top: 0.2rem;
  margin-left: 0.2rem;
`;

const formSchema = z.object({
  userId: z.string(),
  userIdText: z.string().optional(),
  createdById: z.string(),
  reasonId: z.string(),
  reasonIdText: z.string().optional(),
  quantity: z.number().min(1),
  typeId: z.string(),
  typeIdText: z.string().optional(),
  organizationId: z.string(),
  approved: z.boolean().optional(),
  description: z.string().optional(),
  proof: z.string(),
});

type formType = z.infer<typeof formSchema>;

const CreatePunishment: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = router.query;
  const [fileName, setFileName] = useState("");
  const { data: me } = api.users.me.useQuery();
  const { data: organization } =
    api.organizations.getOrganizationWithPunishmentData.useQuery({
      organizationId: me?.data?.user?.organizationId ?? "",
    });

  const {
    handleSubmit,
    register,
    setValue,
    reset: formReset,
    watch,
    formState: { errors },
  } = useForm<formType>({
    defaultValues: {
      userIdText: "",
      reasonIdText: "",
      typeIdText: "",
      createdById: me?.data.user?.id ?? "",
      organizationId:
        (params?.organizationId as string | null) ??
        me?.data.user?.organizationId ??
        "",
      quantity: 1,
      proof: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { mutate: createPunishment } =
    api.punishments.createPunishment.useMutation();

  function handleChange(formKey: keyof formType) {
    return (value: formType[typeof formKey]) => {
      setValue(formKey, value);
    };
  }

  function submit() {
    handleSubmit(onSubmit)().catch((e: Error) => {
      console.warn(e);
    });
  }

  const onSubmit = (data: formType) => {
    const createPunishmentData = {
      userId: data.userId ?? "",
      reasonId: data.reasonId ?? "",
      typeId: data.typeId ?? "",
      organizationId: me?.data.user?.organizationId ?? "",
      createdById: me?.data.user?.id ?? "",
      description: data.description ?? "",
      quantity: data.quantity ?? 1,
      proof: data.proof ?? "",
      approved: false,
    };

    createPunishment(createPunishmentData, {
      onSuccess: () => {
        //Reset everythang for next sp
        setFileName("");
        formReset({
          userId: "",
          userIdText: "",
          typeId: "",
          typeIdText: "",
          reasonId: "",
          reasonIdText: "",
          description: "",
          quantity: 1,
          proof: "",
          createdById: data.createdById,
          organizationId: data.organizationId,
        });
        toast("Punishment created", {
          type: "success",
          position: "bottom-center",
        });
      },
      onError: (e) => toast(e.message, { type: "error" }),
    });
  };

  const userOptions =
    organization?.data?.organization?.users.map((user) => ({
      label: user.name ?? "",
      value: user.id,
    })) ?? [];

  const typeOptions =
    organization?.data?.organization?.punishmentTypes.map((punishmentType) => ({
      label: punishmentType.name ?? "",
      value: punishmentType.id,
    })) ?? [];

  const reasonOptions =
    organization?.data?.organization?.punishmentReasons.map(
      (punishmentReason) => ({
        label: punishmentReason.name ?? "",
        value: punishmentReason.id,
      })
    ) ?? [];

  const fileLabel = fileName
    ? `File uploaded: ${fileName}`
    : "No file selected";
  return (
    <>
      <Wrapper>
        <ContentWrapper>
          <FormWrapper>
            <FormField>
              <label>
                {t("punish.form.user")}{" "}
                {errors.userId?.message && (
                  <ErrorSpan>{errors.typeId?.message}</ErrorSpan>
                )}
              </label>
              <FormSelect
                text={watch("userIdText") ?? ""}
                options={userOptions}
                handleChange={handleChange("userId")}
                handleTextChange={handleChange("userIdText")}
              />
            </FormField>
            <FormField>
              <label>
                {t("punish.form.type")}{" "}
                {errors.typeId?.message && (
                  <ErrorSpan>{errors.typeId.message}</ErrorSpan>
                )}
              </label>
              <FormSelect
                text={watch("typeIdText") ?? ""}
                options={typeOptions}
                handleChange={handleChange("typeId")}
                handleTextChange={handleChange("typeIdText")}
              />
            </FormField>
            <FormField>
              <label>
                {t("punish.form.reason")}{" "}
                {errors.reasonId?.message && (
                  <ErrorSpan>{errors.reasonId.message}</ErrorSpan>
                )}
              </label>
              <FormSelect
                options={reasonOptions}
                text={watch("reasonIdText") ?? ""}
                handleChange={handleChange("reasonId")}
                handleTextChange={handleChange("reasonIdText")}
              />
            </FormField>
            <FormField>
              <label>{t("punish.form.description")}</label>
              <FormInput register={register("description")} />
            </FormField>
            <FormField>
              <label>
                {t("punish.form.amount")}
                {errors.quantity?.message && (
                  <ErrorSpan>{errors.quantity.message}</ErrorSpan>
                )}
              </label>
              <FormNumberInput
                register={register("quantity", {
                  setValueAs: (value: string) => Number(value),
                })}
              />
            </FormField>
            <FormField>
              <label>{fileLabel}</label>
              <CldUploadWidget
                uploadPreset="sp_proof"
                options={{
                  maxFiles: 1,
                  folder: organization?.data.organization?.name,
                }}
                onUpload={(idk: {
                  event: string;
                  info: {
                    path: string;
                    original_filename: string;
                  } | null;
                }) => {
                  if (idk?.event == "success" && idk.info?.path) {
                    handleChange("proof")(idk.info?.path);
                    setFileName(idk.info?.original_filename ?? "");
                  }
                }}
              >
                {({ open }) => {
                  function handleOnClick(
                    e: React.MouseEvent<HTMLButtonElement>
                  ) {
                    e.preventDefault();
                    open();
                  }
                  return <button onClick={handleOnClick}>Upload</button>;
                }}
              </CldUploadWidget>
            </FormField>
            <div>
              {Object.entries(errors).length > 0 && (
                <ErrorSpan>{t("form.error.corrections")}</ErrorSpan>
              )}
            </div>
            <SubmitButton onClick={submit}>Submit</SubmitButton>
            {watch("proof") && (
              <>
                <br></br>
                <label>Preview</label>
                <CldImage
                  src={watch("proof")}
                  width={300}
                  height={300}
                  alt=""
                />
              </>
            )}
          </FormWrapper>
        </ContentWrapper>
      </Wrapper>
    </>
  );
};
export default CreatePunishment;
