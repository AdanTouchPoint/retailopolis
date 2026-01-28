import Image from 'next/image';

interface PngIconProps {
  src: string;
  alt: string;
  className?: string;
}

export const PngIcon = ({ src, alt, className = 'w-8 h-8' }: PngIconProps) => (
  <div className={`relative ${className}`}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain"
      priority={false}
    />
  </div>
);