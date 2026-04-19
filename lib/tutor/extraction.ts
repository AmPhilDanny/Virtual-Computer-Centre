import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      return data.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
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
