import React from "react";
import axios from "axios";

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

interface AudioStreamProps {
  voiceId: string;
  text: string;
  apiKey: string;
  voiceSettings?: VoiceSettings;
  setLoading: (loading: boolean) => void;
  setSourceUrl: (sourceUrl: string) => void;
  setError: (error: string) => void;
}

export async function convertAndStream({
  voiceId,
  text,
  apiKey,
  voiceSettings,
  setLoading,
  setSourceUrl,
  setError,
}: AudioStreamProps) {
  setLoading(true);
  setError("");

  const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
  const headers = {
    "Content-Type": "application/json",
    "xi-api-key": apiKey,
  };

  const body = {
    text,
    voice_settings: voiceSettings,
  };

  try {
    const response = await axios.post(`${baseUrl}/${voiceId}`, body, {
      headers,
      responseType: "blob",
    });

    if (response.status === 200) {
      /**
       * The response.data is a Blob object which looks like this:
       * Blob {size: 123456, type: "audio/mpeg"}
       */
      // Create a URL for the audio blob and update the sourceUrl state variable
      return setSourceUrl(URL.createObjectURL(response.data));
    } else {
      setError("Error: Unable to stream audio.");
    }
  } catch (error) {
    setError("Error: Unable to stream audio.");
  } finally {
    setLoading(false);
  }
}

const AudioStream: React.FC<AudioStreamProps> = ({
  voiceId,
  text,
  apiKey,
  voiceSettings,
}) => {
  const [loading, setLoading] = React.useState(false);

  // State variable to store URL of the audio source
  const [sourceUrl, setSourceUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  // Asynchronous function to fetch audio data and update state variables

  return (
    <div>
      {/* Render an audio element when the source URL is available */}
      {sourceUrl && (
        <audio autoPlay controls>
          <source src={sourceUrl} type="audio/mpeg" />
        </audio>
      )}
      <button type="button" onClick={convertAndStream} disabled={loading}>
        Convert and Stream
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AudioStream;
