export const forceLogout = () => {
  alert("세션 만료, 다시 로그인 후 이용해 주세요");
  window.location.href = "/";
};
