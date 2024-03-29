import { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import FormSelect from "../../../components/input/formSelect";
import { MultiSPContext } from "../context";
import type { CreateMultipleSPUserEntry } from "../types";
import MinusIcon from "./MinusIcon";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  gap: 1rem;
  @media ${(props) => props.theme.media.largeMobile} {
    padding: 0.5rem;
    border-bottom: 2px solid black;
    border-left: 2px solid black;
  }
`;

interface SPRowProps {
  entry: CreateMultipleSPUserEntry;
  userId: string;
  index: number;
  spTypeOptions: {
    label: string;
    value: string;
  }[];
  spReasonOptions: {
    label: string;
    value: string;
  }[];
}

const FormElementWrapper = styled.div`
  flex: 1;
  max-width: 360px;
  width: 100%;

  .-form-select--wrapper {
    max-width: 450px !important;
  }

  .-form-select--base-input {
    max-width: 450px !important;
    min-width: 200px;
  }
`;
// This component is probably redundant, but Ill keep it as I have some ideas for it.
const FormMobileRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  gap: 1rem;
`;
const SPRowInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.colors.green};
  height: 2.5rem;

  :focus {
    outline: ${(props) => props.theme.colors.darkGreen};
    border-color: ${(props) => props.theme.colors.darkGreen};
  }
`;

const RemoveIcon = styled(MinusIcon)`
  justify-self: center;
  align-self: center;
  min-width: 40px;
  min-height: 40px;
`;

const InputAndRemoveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 1rem;
`;

const SPRow: React.FC<SPRowProps> = ({
  entry,
  index,
  spTypeOptions,
  spReasonOptions,
}) => {
  const [typeText, setTypeText] = useState("");
  const [reasonText, setReasonText] = useState("");
  const { handleSPChange, usersSP, handleRemoveSP } =
    useContext(MultiSPContext);

  const userIndex = usersSP.findIndex((user) => user.id === entry.id);
  const setOnMount = useCallback(() => {
    if (spTypeOptions[0]) {
      setTypeText(spTypeOptions[0].label);
      handleSPChange({
        userId: entry.id,
        spIndex: index,
        field: "typeId",
      })(spTypeOptions[0].value);
    }
  }, [entry.id, handleSPChange, index, spTypeOptions]);

  useEffect(() => {
    setOnMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!entry) {
    return <div>waiting for stupidity to fix itself</div>;
  }

  function handleTextChangeType(text: string) {
    setTypeText(text);
  }

  function handleTextChangeReason(text: string) {
    setReasonText(text);
  }

  function handleTextChangeDescription(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    handleSPChange({
      userId: entry.id,
      spIndex: index,
      field: "description",
    })(event.target.value);
  }
  function handleNumberInput(event: React.ChangeEvent<HTMLInputElement>) {
    handleSPChange({
      userId: entry.id,
      spIndex: index,
      field: "quantity",
    })(Number(event.target.value));
  }
  return (
    <Wrapper>
      <FormMobileRow>
        <FormElementWrapper>
          <FormSelect
            options={spTypeOptions}
            placeholder="SP Type"
            handleChange={handleSPChange({
              userId: entry.id,
              spIndex: index,
              field: "typeId",
            })}
            text={typeText}
            handleTextChange={handleTextChangeType}
          />
        </FormElementWrapper>
        <FormElementWrapper>
          <FormSelect
            options={spReasonOptions}
            placeholder="SP Grunn"
            handleChange={handleSPChange({
              userId: entry.id,
              spIndex: index,
              field: "reasonId",
            })}
            handleTextChange={handleTextChangeReason}
            text={reasonText}
          />
        </FormElementWrapper>
        <SPRowInput
          onChange={handleTextChangeDescription}
          value={usersSP[userIndex]?.sp[index]?.description ?? ""}
          placeholder="Beksrivelse"
        />
        <InputAndRemoveWrapper>
          <SPRowInput
            type="number"
            onChange={handleNumberInput}
            value={usersSP[userIndex]?.sp[index]?.quantity ?? 0}
          />
          <RemoveIcon onClick={handleRemoveSP(entry.id, index)} />
        </InputAndRemoveWrapper>
      </FormMobileRow>
    </Wrapper>
  );
};

export default SPRow;
