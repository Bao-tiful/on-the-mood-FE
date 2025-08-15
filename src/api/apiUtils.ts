// GPT

export const handleApiError = (error: any) => {
  if (error.response) {
    // 요청이 전송되었고 서버가 응답한 경우
    console.error('API Error:', error.response.data);
  } else if (error.request) {
    // 요청이 전송되었지만 응답을 받지 못한 경우
    console.error('No response received:', error.request);
  } else {
    // 다른 오류 발생
    console.error('Error:', error.message);
  }
};
