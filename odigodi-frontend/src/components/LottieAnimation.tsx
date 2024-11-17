import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
  animationData: any;
  width?: string;
  height?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ 
  animationData, 
  width = "300px", 
  height = "300px" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 이전 애니메이션 정리
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // 새 애니메이션 생성
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    // 클린업
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [animationData]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height,
        overflow: 'hidden' // SVG 오버플로우 방지
      }}
    />
  );
};

export default React.memo(LottieAnimation);