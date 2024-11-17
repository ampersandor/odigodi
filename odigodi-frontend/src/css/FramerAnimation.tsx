import { Variants, Transition } from 'framer-motion';

// 페이지 애니메이션 변형 정의
export const pageVariants: Variants = {
  init: {
    opacity: 0,
    y: '-100%',
  },
  anim: {
    opacity: 1,
    y: 0,
  },
  last: {
    opacity: 0,
    y: '-100%',
  },
};

// 페이지 전환 설정 정의
export const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 1,
};

// 추가적인 애니메이션 설정들을 여기에 추가할 수 있습니다
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
};

export const scaleVariants: Variants = {
  init: {
    scale: 0.8,
    opacity: 0
  },
  anim: {
    scale: 1,
    opacity: 1
  }
};

// 타입 정의
export interface AnimationConfig {
  variants: Variants;
  transition: Transition;
}

// 미리 정의된 애니메이션 설정
export const defaultAnimationConfig: AnimationConfig = {
  variants: pageVariants,
  transition: pageTransition
};