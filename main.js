import { TextToSpeech } from './TextToSpeech.js';
import { VoiceRecorder } from './VoiceRecorder.js';
import { VideoRecorder } from './VideoRecorder.js';
import { SpeechToText } from './SpeechToText.js';

const ttsElements = document.querySelectorAll('text-to-speech');
const textToSpeech1 = new TextToSpeech(ttsElements[0]);
const textToSpeech2 = new TextToSpeech(ttsElements[1]);
const voiceRecorder = new VoiceRecorder();
const speechToText = new SpeechToText();
const videoRecorder = new VideoRecorder();

