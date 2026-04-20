export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      return data.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (mimeType === "text/plain") {
      return buffer.toString("utf8");
    }
    return "";
  } catch (error) {
    console.error("Text extraction failed:", error);
    return "";
  }
}
