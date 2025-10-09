import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const { OPENAI_API_KEY } = process.env;

// JSON Validator Tool
export const jsonValidatorTool = createTool({
    id          : 'validate-json-config',
    description : 'Validate and parse JSON configuration files',
    inputSchema : z.object({
        jsonContent : z.string()
    }),
    outputSchema : z.object({
        isValid    : z.boolean(),
        parsedData : z.any(),
        errors     : z.array(z.string()).optional()
    }),
    async execute({ context }) {
        // JSON validation logic
        return validateJson(context.jsonContent);
    }
});

const validateJson = async (jsonContent: string) => {
    const parsedData = JSON.parse(jsonContent);
    return parsedData;
};
