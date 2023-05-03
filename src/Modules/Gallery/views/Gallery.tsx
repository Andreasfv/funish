import styled from "styled-components";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import cloudinary from "cloudinary";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import { CldImage } from "next-cloudinary";
import GalleryImage from "../components/GalleryImage";
import { useImageModal } from "../../../utils/hooks/useImageModal";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  padding: 1rem;
  gap: 1rem;
`;

const Gallery: React.FC = () => {
  const router = useRouter();
  const { organizationId } = router.query;
  const [ImageModal, openImage] = useImageModal();
  const { data, isLoading } = api.image.getGalleryImages.useQuery(
    {
      organizationId: organizationId as string,
    },
    {
      enabled: !!organizationId,
    }
  );

  function handleOpenImage(image: string) {
    return () => {
      openImage(image);
    };
  }

  const images = data?.map((image, i) => (
    <GalleryImage onClick={handleOpenImage(image)} src={image} key={i} />
  ));
  return (
    <BasePageLayout>
      <Wrapper>
        <ImageModal />
        <ContentWrapper>{images}</ContentWrapper>
      </Wrapper>
    </BasePageLayout>
  );
};

export default Gallery;
