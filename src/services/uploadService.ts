import axios from "axios";

// Instância do Axios para nossas APIs internas (com token)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface SignedUrlResponse {
  signedUrl: string;
  finalFileUrl: string;
}

/**
 * Orquestra o processo de upload de arquivo usando URLs pré-assinadas.
 * @param file O objeto File a ser enviado.
 * @param uploadType O tipo de upload ('avatar' ou 'background').
 * @returns A URL pública final do arquivo no R2.
 */
export async function uploadFileWithSignedUrl(
  file: File,
  uploadType:
    | "avatar"
    | "background"
    | "audio"
    | "cursor"
    | "template_preview"
    | "video"
): Promise<string> {
  try {
    // --- PASSO 1: Pedir a URL pré-assinada para o nosso backend ---
    const response = await api.post<SignedUrlResponse>("/uploads/signed-url", {
      fileName: file.name,
      contentType: file.type,
      uploadType: uploadType,
    });

    const { signedUrl, finalFileUrl } = response.data;

    // --- PASSO 2: Fazer o upload do arquivo para a URL pré-assinada (direto para o R2) ---
    // Usamos o Axios para isso, mas sem a baseURL e sem o token de autenticação.
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // --- PASSO 3: Retornar a URL final e pública do arquivo ---
    return finalFileUrl;
  } catch (error) {
    console.error("Falha no processo de upload:", error);
    throw new Error("Não foi possível enviar o arquivo.");
  }
}
