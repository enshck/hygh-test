interface UploadUrlResult {
  id: string;
  uploadUrl: string;
}

export const getUploadUrl = async () => {
  const res = await fetch('/upload-url');

  return (await res.json()) as UploadUrlResult;
};

interface UploadFilesResult {
  data: string[];
}

export const uploadFiles = async (
  files: File[],
  uploadUrl: string,
  signal: AbortSignal
) => {
  const formData = new FormData();

  files.forEach((elem) => {
    formData.append('file', elem, elem.name);
  });

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
    signal,
  });

  return (await res.json()) as UploadFilesResult;
};
