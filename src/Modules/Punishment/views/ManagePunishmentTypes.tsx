import { zodResolver } from "@hookform/resolvers/zod";
import type { PunishmentType } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import FormInput from "../../../components/input/formInput";
import FormNumberInput from "../../../components/input/formNumberInput";
import { api } from "../../../utils/api";
import FormField from "../components/FormField";
import PunishmentTypeRow from "../components/PunishmentTypeRow";
import SubmitButton from "../components/SubmitButton";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.7rem;
  max-width: 500px;
  padding: 1rem;
  width: 100%;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

interface ManagePunishmentTypesProps {
  punishmentTypes: PunishmentType[];
  refetch: () => void;
}

const formSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  description: z.string().optional(),
});

type formType = z.infer<typeof formSchema>;

const ManagePunishmentTypes: React.FC<ManagePunishmentTypesProps> = ({
  punishmentTypes,
  refetch,
}) => {
  const router = useRouter();
  const { organizationId } = router.query;
  const { mutate: createPunishmentType } =
    api.punishmentTypes.createPunishmentType.useMutation();
  const {
    handleSubmit,
    register,
  } = useForm<formType>({
    defaultValues: {
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  const rows = punishmentTypes.map((punishmentType, index) => {
    return (
      <PunishmentTypeRow
        key={index}
        punishmentType={punishmentType}
        refetch={refetch}
      />
    );
  });

  function submit() {
    handleSubmit(onSubmit)()
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function onSubmit(data: formType) {
    console.log("YEAH");
    const submitData = {
      ...data,
      organizationId: organizationId as string,
      quantityToFulfill: data.quantity,
      description: data.description ?? "",
    };
    console.log("HELP?");
    createPunishmentType(submitData);
  }

  return (
    <ContentWrapper>
      <FormWrapper>
        <FormField>
          <label htmlFor="name">Name</label>
          <FormInput register={register("name")} />
        </FormField>
        <FormField>
          <label htmlFor="quantity">Quantity</label>
          <FormNumberInput
            register={register("quantity", {
              valueAsNumber: true,
            })}
          />
        </FormField>
        <FormField>
          <label htmlFor="description">Description</label>
          <FormInput register={register("description")} />
        </FormField>
        <FormField>
          <SubmitButton onClick={submit}>Submit</SubmitButton>
        </FormField>
      </FormWrapper>
      <br></br>
      <FormWrapper>{rows}</FormWrapper>
    </ContentWrapper>
  );
};

export default ManagePunishmentTypes;
