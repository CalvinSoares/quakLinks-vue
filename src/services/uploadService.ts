import axios from "axios";
import api from "./api";

interface SignedUrlResponse {
  signedUrl: string;
  finalFileUrl: string;
}

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
    const response = await api.post<SignedUrlResponse>("/uploads/signed-url", {
      fileName: file.name,
      contentType: file.type,
      uploadType: uploadType,
    });

    const { signedUrl, finalFileUrl } = response.data;

    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return finalFileUrl;
  } catch (error) {
    console.error("Falha no processo de upload:", error);
    throw new Error("Não foi possível enviar o arquivo.");
  }
}
