type ErrorMessages = Record<string, Record<string, string>>;

const errorMessages: ErrorMessages = {
  ja: {
    "auth/invalid-email": "メールアドレスの形式が間違っています",
    "auth/user-disabled": "このユーザは無効化されています",
    "auth/user-not-found": "ユーザが見つかりません",
    "auth/wrong-password": "パスワードが間違っています"
  }
};

export interface FirebaseError extends Error {
  code: string;
}

export const getErrorMessage = (error: FirebaseError, lang = "ja") => {
  return errorMessages[lang]?.[error.code] || error.message;
};
