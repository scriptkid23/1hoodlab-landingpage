import React from "react";

interface SocialLinkProps {
  href: string;
  iconSrc: string;
  altText: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, iconSrc, altText }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-black-950 inline-flex w-[30px] h-[30px] items-center justify-center rounded-full"
    >
      <img src={iconSrc} width={15} alt={altText} />
    </a>
  );
};

export default SocialLink;
