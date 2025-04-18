import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export const mcpServer = new McpServer(
  {
    name: "acurast-mcp-server",
    version: "1.0.0",
  },
  { capabilities: { logging: {} } }
);

mcpServer.prompt(
  "review-manager-processors",
  "A prompt to review the processor performance of a manager",
  { managerAddress: z.string().describe("The address of the manager") },
  ({ managerAddress }) => {
    console.log("review-manager-processors called", managerAddress);
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

// Register a tool specifically for testing resumability
// mcpServer.tool(
//   "start-notification-stream",
//   "Starts sending periodic notifications for testing resumability",
//   {
//     interval: z
//       .number()
//       .describe("Interval in milliseconds between notifications")
//       .default(100),
//     count: z
//       .number()
//       .describe("Number of notifications to send (0 for 100)")
//       .default(10),
//   },
//   async (
//     { interval, count },
//     { sendNotification }
//   ): Promise<CallToolResult> => {
//     const sleep = (ms: number) =>
//       new Promise((resolve) => setTimeout(resolve, ms));
//     let counter = 0;

//     while (count === 0 || counter < count) {
//       counter++;
//       try {
//         await sendNotification({
//           method: "notifications/message",
//           params: {
//             level: "info",
//             data: `Periodic notification #${counter} at ${new Date().toISOString()}`,
//           },
//         });
//       } catch (error) {
//         console.error("Error sending notification:", error);
//       }
//       // Wait for the specified interval
//       await sleep(interval);
//     }

//     return {
//       content: [
//         {
//           type: "text",
//           text: `Started sending periodic notifications every ${interval}ms`,
//         },
//       ],
//     };
//   }
// );

// Create a simple resource at a fixed URI
// server.resource(
//   "greeting-resource",
//   "https://example.com/greetings/default",
//   { mimeType: "text/plain" },
//   async (): Promise<ReadResourceResult> => {
//     return {
//       contents: [
//         {
//           uri: "https://example.com/greetings/default",
//           text: "Hello, world!",
//         },
//       ],
//     };
//   }
// );

mcpServer.tool(
  "deployScript",
  "Deploy a script on Acurast.",
  { script: z.string().describe("The script, either js code or an ipfs hash") },
  async ({ script }) => {
    console.log("deployScript called with:", script);
    return {
      content: [{ type: "text", text: "Script deployed" }],
    };
  }
);

mcpServer.resource(
  "get-processor-count",
  "https://acurast.com/api/v1/processors",
  async (uri) => {
    console.log("get-processor-count called", uri);

    // Do API request

    return {
      contents: [
        {
          uri: uri.href,
          text: "123",
        },
      ],
    };
  }
);

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
          text: `{"address":"5w93kd","lastHeartbeat":"4 minutes ago","rewardsReceivedInLastHour":"4"}`,
        },
      ],
    };
  }
);
