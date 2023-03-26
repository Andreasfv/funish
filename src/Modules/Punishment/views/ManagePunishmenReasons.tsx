import { zodResolver } from "@hookform/resolvers/zod";
import type { PunishmentReason} from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { z } from "zod";
import FormInput from "../../../components/input/formInput";
import { api } from "../../../utils/api";
import FormField from "../components/FormField";
import PunishmentReasonRow from "../components/PunishmentReasonRow";
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

interface ManagePunishmentReasonsProps {
  punishmentReasons: PunishmentReason[];
  refetch: () => void;
}

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

type formType = z.infer<typeof formSchema>;

const ManagePunishmentReasons: React.FC<ManagePunishmentReasonsProps> = ({
  punishmentReasons,
  refetch,
}) => {
  const router = useRouter();
  const { organizationId } = router.query;
  const { mutate: createPunishmentType } =
    api.punishmentReasons.createPunishmentReason.useMutation({
      onSuccess: () => {
        toast("Punishment reason created", { type: "success", position: "bottom-center" })
        resetForm({
          description: "",
          name: "",
        })
      }
    });

  const {
    handleSubmit,
    register,
    reset: resetForm,
  } = useForm<formType>({
    defaultValues: {
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  const rows = punishmentReasons.map((punishmentReason, index) => {
    return (
      <PunishmentReasonRow
        key={index}
        punishmentReason={punishmentReason}
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

export default ManagePunishmentReasons;
