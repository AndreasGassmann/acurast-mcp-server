import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const mcpServer = new McpServer({
  name: "Acurast MCP Server",
  version: "0.0.1",
});

const numberOfProcessors = 15203;

mcpServer.tool("deployScript", { script: z.string() }, async ({ script }) => {
  console.log("deployScript called with:", script);
  return {
    content: [{ type: "text", text: "Script deployed" }],
  };
});

mcpServer.prompt(
  "review-manager-processors",
  { managerAddress: z.string() },
  ({ managerAddress }) => {
    console.log("review-manager called", managerAddress);
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review the processor performance of the following manager:\n\n${managerAddress}`,
          },
        },
      ],
    };
  }
);

mcpServer.resource(
  "getProcessorCount",
  "https://acurast.com/api/v1/processors",
  async (uri) => {
    console.log("getProcessorCount called", uri);
    return {
      contents: [
        {
          uri: uri.href,
          text: "App configuration here",
        },
      ],
    };
  }
);

// Dynamic resource with parameters
mcpServer.resource(
  "processor-detail",
  new ResourceTemplate(
    "https://acurast.com/api/v1/processors/{processorId}/detail",
    { list: undefined }
  ),
  async (uri, { processorId }) => {
    console.log("processor-detail called", uri, processorId);
    return {
      contents: [
        {
          uri: uri.href,
          text: `Details for processor ${processorId}`,
        },
      ],
    };
  }
);
