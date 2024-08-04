import { Box, Textarea, Button, Center, Text, Stack, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import Layout from "./Layout";
import MarkdownComponent from "./MarkdownComponent";
import PageCard from "./PageCard";

export default function ScriptingPage() {
    const [scriptInput, setScriptInput] = useState("");
    const [scriptResult, setScriptResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Handle changes to the input textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setScriptInput(e.target.value);
    };

    // Handle script generation
    const handleGenerateScript = async () => {
        const result = await fetchOpenAIScript(scriptInput);
        console.log(result)
        if (result) {
            setScriptResult(result);
        } else {
            setScriptResult("An error occurred while generating the script.");
        }
    };

    // Fetch OpenAI script from the API endpoint
    const fetchOpenAIScript = async (input: string) => {
        try {
          // console.log({input})
          setIsLoading(true);
            const response = await fetch("/api/scripting", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input }),
            });
            setIsLoading(false);
            // Handle response from the API
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            // console.log(data);
            return data.script;
        } catch (err) {
          setIsLoading(false);
            console.error("Error fetching OpenAI script:", err);
            return null;
        }
    };

    return (
        <Layout>
            <PageCard
                pageName="Scripting Page"
                pageDesc="This page allows content creators to generate scripts using OpenAI integration."
            />

            <Box mb={4}>
                <Textarea
                    placeholder="Enter your script idea here..."
                    value={scriptInput}
                    onChange={handleInputChange}
                    mb={2}
                />
            </Box>

            <Center mb={4}>
                <Button
                    width="full"
                    colorScheme="teal"
                    variant="outline"
                    onClick={handleGenerateScript}
                >
                    Generate Script
                </Button>
            </Center>

            <Box borderWidth="1px" borderRadius="lg" p={4}>
              {isLoading ? (
                <Stack>
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <MarkdownComponent content={scriptResult} />

              )}
            </Box>
        </Layout>
    );
}
