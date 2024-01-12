import Image from "next/image";

type AvatarProps = {
  src: string;
  alt: string;
}

const Avatar = ({ src, alt }: AvatarProps) => {
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-full"
      >

      </Image>
    </div>
  );
}

export default Avatar;