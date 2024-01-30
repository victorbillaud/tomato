'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';

type CardProps = {
  image: string;
  children?: React.ReactNode;
};

const Card = ({ image, children }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [shadowColor, setShadowColor] = useState(
    typeof window !== 'undefined' &&
      window?.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'rgba(255, 255, 255, 0.20)'
      : 'rgba(0, 0, 0, 0.20)'
  );

  function renderRotate(e: React.MouseEvent<HTMLDivElement>) {
    if (cardRef.current) {
      const { left, top, width, height } =
        cardRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = (y - height / 2) / 10;
      const rotateY = (x - width / 2) / 10;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      cardRef.current.style.boxShadow = `${-rotateY / 2}px ${
        rotateX / 2
      }px 20px ${shadowColor}`;
      cardRef.current.style.transition = 'none';
    }
  }

  function clearRotate() {
    if (cardRef.current) {
      cardRef.current.style.transition = 'all 0.3s ease';
      cardRef.current.style.boxShadow = '0 0 20px ${shadowColor}';
      cardRef.current.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  }

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div onMouseMove={renderRotate} onMouseLeave={clearRotate}>
        <div
          ref={cardRef}
          className='overflow-hidden rounded-lg'
          style={{ boxShadow: `0 0 20px ${shadowColor}` }}
        >
          <Image src={image} alt='card' width={300} height={300} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
