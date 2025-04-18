import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

// mcpServer.resource("getProcessorCount", async () => {
//   console.log("getProcessorCount called");
//   return {
//     content: [{ type: "text", text: String(numberOfProcessors) }],
//   };
// });
