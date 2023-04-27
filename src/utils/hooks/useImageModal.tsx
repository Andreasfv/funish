import { CldImage } from "next-cloudinary";
import { useCallback, useEffect, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const Image = styled(CldImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Close = styled.button`
  font-size: 2.5rem;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 25px;
  top: 75px;
  width: 50px;
  height: 50px;
  background: white;
  border: 2px solid white;
  border-radius: 50%;

  :hover {
    cursor: pointer;
    color: gray;
  }
`;
type ImageModalReturn = [
  React.FC,
  (image: string) => void,
  () => void,
  boolean
];
export const useImageModal = (): ImageModalReturn => {
  const [Modal, open, close, isOpen] = useModal("image-modal", {});
  const [image, setImage] = useState("");

  const openModal = useCallback(
    (image: string) => {
      if (!image || image === "") return;
      setImage(image);
      open();
    },
    [open, setImage]
  );

  const closeModal = useCallback(() => {
    close();
  }, [close]);

  const ImageModal: React.FC = () => {
    return (
      <Modal>
        <Wrapper>
          <Image src={image} alt="" width={1200} height={1200} />
          <Close
            onClick={() => {
              close();
            }}
          >
            X
          </Close>
        </Wrapper>
      </Modal>
    );
  };

  return [ImageModal, openModal, closeModal, isOpen];
};
