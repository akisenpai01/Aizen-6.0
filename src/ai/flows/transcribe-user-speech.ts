// This is an empty file since STT will be handled natively in Kotlin.

/**
 * @fileOverview This file is intentionally empty.
 * It serves as a placeholder for the transcribeUserSpeech flow, which will be implemented natively in Kotlin.
 */

export type TranscribeUserSpeechInput = string;

export type TranscribeUserSpeechOutput = string;

export async function transcribeUserSpeech(audioDataUri: TranscribeUserSpeechInput): Promise<TranscribeUserSpeechOutput> {
  console.log('STT will be handled natively in Kotlin.');
  return 'STT will be handled natively in Kotlin.';
}
