import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import styled from "styled-components";

const UploadButton = styled.button`
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.lightDarkGreen};
`;

interface UploadImageButtonProps {
  uploadFolder: string;
  handleChange: (value: string) => void;
  setFileName: (value: React.SetStateAction<string>) => void;
}
const UploadImageButton: React.FC<UploadImageButtonProps> = ({
  uploadFolder,
  handleChange,
  setFileName,
}) => {
  return (
    <CldUploadWidget
      uploadPreset="sp_proof"
      options={{
        maxFiles: 1,
        folder: uploadFolder,
      }}
      onUpload={(idk: {
        event: string;
        info: {
          path: string;
          original_filename: string;
        } | null;
      }) => {
        if (idk?.event == "success" && idk.info?.path) {
          handleChange(idk.info?.path);
          setFileName(idk.info?.original_filename ?? "");
        }
      }}
    >
      {({ open }) => {
        function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
          e.preventDefault();
          open();
        }
        return <UploadButton onClick={handleOnClick}>Last opp</UploadButton>;
      }}
    </CldUploadWidget>
  );
};

export default UploadImageButton;
