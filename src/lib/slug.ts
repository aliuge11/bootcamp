import { customAlphabet } from "nanoid";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export const generateUploadId = customAlphabet(ALPHABET, 10);
