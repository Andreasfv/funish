import { useRouter } from "next/router";
import styled from "styled-components";
import { api } from "../../../utils/api";
import { useImageModal } from "../../../utils/hooks/useImageModal";
import { BasePageLayout } from "../../BasePageLayout.tsx/view/BasePageLayout";
import GalleryImage from "../components/GalleryImage";

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

// Super basic and more a proof of concept than anything else.
const Gallery: React.FC = () => {
  const router = useRouter();
  const { organizationId } = router.query;
  const [ImageModal, openImage] = useImageModal();
  const { data } = api.image.getGalleryImages.useQuery(
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
