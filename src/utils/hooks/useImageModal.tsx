import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { useModal } from "react-hooks-use-modal";
import styled from "styled-components";

const Wrapper = styled.div``;

const Image = styled(CldImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Close = styled.div`
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
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: true,
    },
  });
  const [image, setImage] = useState("");

  function openModal(image: string) {
    if (!image || image === "") return;
    setImage(image);
    open();
  }

  const ImageModal: React.FC = () => {
    return (
      <Modal>
        <Wrapper>
          <Image src={image} alt="" width={700} height={700} />
          <Close onClick={close} tabIndex={0}>
            X
          </Close>
        </Wrapper>
      </Modal>
    );
  };

  return [ImageModal, openModal, close, isOpen];
};
