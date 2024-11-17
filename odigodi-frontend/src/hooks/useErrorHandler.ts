// import { useCallback } from 'react';
// import { ApiError } from '../types';

// export const useErrorHandler = () => {
//   const handleError = useCallback((error: unknown) => {
//     if ((error as ApiError).status) {
//       const apiError = error as ApiError;
//       // API 에러 처리
//       console.error(`API Error: ${apiError.message}`);
//       // 필요한 경우 토스트 메시지나 에러 모달 표시
//     } else {
//       // 일반 에러 처리
//       console.error('An unexpected error occurred:', error);
//     }
//   }, []);

//   return { handleError };
// };