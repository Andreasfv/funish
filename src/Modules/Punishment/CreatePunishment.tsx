import React from "react";
import styled from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import FormInput from "../../components/input/formInput";
import { useTranslation } from "react-i18next";
import FormSelect from "../../components/input/formSelect";
import { useRouter } from "next/router";
import FormNumberInput from "../../components/input/formNumberInput";
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 700px;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
  label {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    color: ${(props) => props.theme.colors.gray5};
  }
`;
const SubmitButton = styled.button`
  width: 100%;
  height: 2.5rem;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.green};

  :hover {
    border: 2px solid ${(props) => props.theme.colors.darkGreen};
  }

  :focus {
    background-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

const ErrorSpan = styled.span`
  color: ${(props) => props.theme.colors.red};
  font-size: 0.8rem;
  margin-top: 0.2rem;
  margin-left: 0.2rem;
`;

const formSchema = z.object({
  userId: z.string(),
  createdById: z.string(),
  reasonId: z.string(),
  quantity: z.number().min(1),
  typeId: z.string(),
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
  const { data: me } = api.users.me.useQuery();
  const { data: organization } =
    api.organizations.getOrganizationWithPunishmentData.useQuery(
      me?.data?.user?.organizationId ?? ""
    );

  const {
    handleSubmit,
    register,
    setValue,

    formState: { errors },
  } = useForm<formType>({
    defaultValues: {
      createdById: me?.data.user?.id ?? "",
      organizationId:
        (params?.organizationId as string | null) ??
        me?.data.user?.organizationId ??
        "",
      quantity: 1,
      proof: "Not implemented",
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
      ...data,
      organizationId: me?.data.user?.organizationId ?? "",
      createdById: me?.data.user?.id ?? "",
      description: data.description ?? "",
    };

    createPunishment(createPunishmentData);
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
                options={userOptions}
                handleChange={handleChange("userId")}
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
                options={typeOptions}
                handleChange={handleChange("typeId")}
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
                handleChange={handleChange("reasonId")}
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
              <label>TODO: Upload pic?</label>
            </FormField>
            <div>
              {Object.entries(errors).length > 0 && (
                <ErrorSpan>{t("form.error.corrections")}</ErrorSpan>
              )}
            </div>
            <SubmitButton onClick={submit}>Submit</SubmitButton>
          </FormWrapper>
        </ContentWrapper>
      </Wrapper>
    </>
  );
};
export default CreatePunishment;
