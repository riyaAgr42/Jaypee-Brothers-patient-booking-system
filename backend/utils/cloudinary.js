import crypto from "crypto";

const isDataImage = (value) =>
  typeof value === "string" && value.startsWith("data:image/");

export const uploadImageToCloudinary = async (image) => {
  if (!isDataImage(image)) {
    return image || "";
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are missing in environment variables.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "docease/doctors";
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new URLSearchParams({
    file: image,
    folder,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature
  });

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body
    }
  );

  const data = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(data.error?.message || "Image upload failed.");
  }

  return data.secure_url;
};
