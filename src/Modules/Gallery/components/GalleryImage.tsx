import { CldImage } from "next-cloudinary";
import styled from "styled-components";

const Wrapper = styled.div``;

interface GalleryImageProps {
  src: string;
  onClick?: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ src, onClick }) => {
  return (
    <Wrapper onClick={onClick}>
      <CldImage onClick={onClick} src={src} width={200} height={200} alt="" />
    </Wrapper>
  );
};

export default GalleryImage;
