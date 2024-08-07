import Layout from "./Layout";
import PageCard from "./PageCard";
import { Input, InputGroup, InputLeftElement, Button, Box, Text, Center, Spinner } from "@chakra-ui/react";
import { useState } from 'react';

export default function TranscriptionPage() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 

  const handleFileUpload = (event:any) => {
    setAudioFile(event.target.files[0]);
  };
console.log(audioFile)
  const handleTranscription = async () => {
    if (!audioFile) {
      alert('Please upload an audio file first.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioFile);
    

    try {
      setIsLoading(true); 
      const response = await fetch('/api/transcription', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTranscription(data.transcription || "No transcription result available");
    } catch (error) {
      console.error('Error fetching transcription:', error);
      setTranscription('Error processing the audio.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Layout>
      <PageCard
        pageName="Transcription Page"
        pageDesc="This page allows content creators to transcribe audio files to text."
      />
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <i className="fa fa-file-audio" />
        </InputLeftElement>
        <Input type='file' onChange={handleFileUpload} />
      </InputGroup>
      <Button
        mt={4}
        colorScheme="teal"
        onClick={handleTranscription}
        isLoading={isLoading} 
      >
        Transcribe
      </Button>
      {isLoading ? (
        <Center mt={4}>
          <Spinner size="lg" />
        </Center>
      ) : (
        <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
          <Text>{transcription}</Text>
        </Box>
      )}
    </Layout>
  );
}
