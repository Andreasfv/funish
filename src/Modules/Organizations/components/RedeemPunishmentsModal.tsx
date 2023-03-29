import { zodResolver } from "@hookform/resolvers/zod";
import { PunishmentType } from "@prisma/client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { z } from "zod";
import FormButton from "../../../components/input/formButton";
import FormNumberInput from "../../../components/input/formNumberInput";
import FormSelect from "../../../components/input/formSelect";
import { useAdmin } from "../../../utils/admin/useAdmin";
import { api } from "../../../utils/api";
import FormField from "../../Punishment/components/FormField";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90vw;
  max-width: 500px;
  min-width: 300px;
  padding: 1rem;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.lightGreen};
  gap: 0.4rem;
  max-height: 600px;
  border-radius: 0.5rem;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
`;

const RedemptionTitle = styled.div`
  display: flex;
  width: 100%;
  font-weight: 600;
  font-size: 1.2rem;
  justify-content: center;
  align-items: center;
`;

const redeemFormSchema = z.object({
  type: z.string(),
  typeString: z.string(),
  quantity: z.number().min(1),
});

type redeemFormType = z.infer<typeof redeemFormSchema>;

interface RedeemPunishmentsModalProps {
  userId: string;
  organizationId: string;
  punishmentTypes: PunishmentType[];
  refetch: () => void;
  close: () => void;
}

export const RedeemPunishmentsModal: React.FC<RedeemPunishmentsModalProps> = ({
  userId,
  organizationId,
  punishmentTypes,
  refetch,
  close,
}) => {
  const isAdmin = useAdmin();
  const { handleSubmit, setValue, register, watch } = useForm<redeemFormType>({
    resolver: zodResolver(redeemFormSchema),
  });

  function handleChange(formKey: keyof redeemFormType) {
    return (value: redeemFormType[typeof formKey]) => {
      setValue(formKey, value);
    };
  }

  const typeOptions: {
    value: string;
    label: string;
  }[] = useMemo(() => {
    if (!punishmentTypes) return [];
    return punishmentTypes.map((type) => {
      return {
        value: type.id,
        label: type.name,
      };
    });
  }, [punishmentTypes]);

  const { mutate: redeemPunishmentsMutation } =
    api.punishmentTypes.redeemPunishments.useMutation({
      onSuccess: () => {
        close();
        toast("Punishments redeemed! WOP", {
          type: "success",
          position: "bottom-center",
        });
      },
      onError: (err) => {
        toast(err.message, {
          type: "error",
          position: "bottom-center",
        });
      },
    });

  const redeemPunisments = (data: redeemFormType) => {
    const input = {
      punishmentTypeId: data.type,
      quantity: data.quantity,
      userId: userId,
      organizationId: organizationId,
    };
    redeemPunishmentsMutation(input, {
      onSuccess: () => {
        void refetch();
      },
    });
  };

  function redeemFormSubmit() {
    handleSubmit(redeemPunisments)().catch(() => {
      toast("Failed to redeem punishments", {
        type: "error",
        position: "bottom-center",
      });
    });
  }

  return (
    <ContentWrapper>
      <FormWrapper>
        <RedemptionTitle>Redeem Punishments</RedemptionTitle>
        <FormField>
          <label>Punishment Type</label>
          <FormSelect
            text={watch("typeString") ?? ""}
            options={typeOptions}
            handleChange={handleChange("type")}
            handleTextChange={handleChange("typeString")}
          />
        </FormField>
        <FormField>
          <label>Quantity</label>
          <FormNumberInput
            register={register("quantity", {
              valueAsNumber: true,
            })}
          />
        </FormField>
        <FormField>
          <FormButton onClick={redeemFormSubmit}>Redeem</FormButton>
        </FormField>
      </FormWrapper>
    </ContentWrapper>
  );
};

export default RedeemPunishmentsModal;
