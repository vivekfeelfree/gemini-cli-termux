/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { debugLogger } from '../utils/debugLogger.js';
import type { Config } from '../config/config.js';
import { DEFAULT_GEMINI_FLASH_MODEL } from '../config/models.js';

export class SpeechService {
  private currentProcess: ChildProcess | null = null;

  constructor(private readonly config: Config) {}

  /**
   * Stop any currently playing speech.
   */
  stop(): void {
    if (this.currentProcess) {
      try {
        this.currentProcess.kill('SIGTERM');
        debugLogger.debug('Stopped active TTS process.');
      } catch (e) {
        debugLogger.error('Failed to stop TTS process:', e);
      }
      this.currentProcess = null;
    }
  }

  /**
   * Speak the given text. Stops any previous speech first.
   */
  async speak(text: string): Promise<void> {
    this.stop();

    if (!text.trim()) return;

    // TERMUX PATCH: Use native termux-tts-speak
    try {
      this.currentProcess = spawn('termux-tts-speak', [], {
        stdio: ['pipe', 'ignore', 'pipe'],
        detached: true,
      });

      this.currentProcess.on('error', (err) => {
        debugLogger.error('❌ Auto-speak spawn error:', err);
        this.currentProcess = null;
      });

      this.currentProcess.on('exit', () => {
        this.currentProcess = null;
      });

      if (this.currentProcess.stderr) {
        this.currentProcess.stderr.on('data', (data) => {
          debugLogger.error(`❌ TTS stderr: ${data}`);
        });
      }

      this.currentProcess.stdin?.write(text);
      this.currentProcess.stdin?.end();
      this.currentProcess.unref();
    } catch (e) {
      debugLogger.error('❌ Failed to auto-speak response:', e);
      this.currentProcess = null;
    }
  }

  /**
   * Generates a concise summary of the text and speaks it.
   */
  async speakHighlights(fullText: string): Promise<void> {
    // If text is short enough, just speak it.
    if (fullText.length < 300) {
      return this.speak(fullText);
    }

    try {
      debugLogger.debug('Generating TTS summary...');
      const summary = await this.generateSummary(fullText);
      if (summary) {
        await this.speak(summary);
      } else {
        // Fallback to full text if summarization fails
        await this.speak(fullText);
      }
    } catch (e) {
      debugLogger.error('Failed to generate speech summary:', e);
      // Fallback
      await this.speak(fullText);
    }
  }

  private async generateSummary(text: string): Promise<string | undefined> {
    const generator = this.config.getContentGenerator();
    if (!generator) return undefined;

    // Use a fast model for summarization (Flash)
    const model = DEFAULT_GEMINI_FLASH_MODEL;

    const prompt = `Summarize the following response into 1-2 concise, conversational sentences suitable for text-to-speech. Capture the core outcome or key insight only. Do not use formatting like markdown or lists.

Text to summarize:
${text}`;

    try {
      const result = await generator.generateContent(
        {
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.3, // Low temperature for deterministic/concise output
          },
        },
        'tts-summarizer', // Prompt ID for logging
      );

      const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      return summaryText?.trim();
    } catch (e) {
      debugLogger.warn('TTS Summarization request failed:', e);
      return undefined;
    }
  }
}
