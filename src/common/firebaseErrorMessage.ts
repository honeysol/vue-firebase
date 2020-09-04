const errorMessages: any = {
  ja: {
    "auth/invalid-email": "メールアドレスの形式が間違っています",
    "auth/user-disabled": "このユーザは無効化されています",
    "auth/user-not-found": "ユーザが見つかりません",
    "auth/wrong-password": "パスワードが間違っています"
  }
};

export const getErrorMessage = (error: any, lang = "ja") => {
  return errorMessages[lang][error.code] || error.message;
};
