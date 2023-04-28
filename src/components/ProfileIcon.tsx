import styled from "styled-components";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

export const ProfileIconWrapper = styled.div``;

interface ProfileIconProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProfileIconCld = styled(CldImage)`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 50%;
`;

const ProfileIconNonCld = styled(Image)`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 50%;
`;
export const ProfileIcon: React.FC<ProfileIconProps> = ({
  src,
  width = 20,
  height = 20,
  alt = "",
  ...props
}) => {
  const isCld = !src?.includes("https");
  if (isCld) {
    return (
      <ProfileIconCld
        src={src ?? ""}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
    );
  }
  return (
    <ProfileIconNonCld
      src={src ?? ""}
      width={width}
      height={height}
      alt={alt}
      {...props}
    />
  );
};
