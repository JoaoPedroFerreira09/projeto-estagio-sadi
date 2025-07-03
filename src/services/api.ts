let shouldSucceed = true;

export const processImagesAPI = (): Promise<{ status: number; message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        shouldSucceed = !shouldSucceed;
        resolve({ status: 200, message: "Imagens processadas com sucesso!" });
      } else {
        shouldSucceed = !shouldSucceed;
        reject({ status: 500, message: "Erro no servidor ao processar imagens." });
      }
    }, 1500);
  });
};