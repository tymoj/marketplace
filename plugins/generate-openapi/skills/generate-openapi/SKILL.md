---
name: generate-openapi
description: Analyzes code and generates comprehensive OpenAPI specs that can be used directly with OpenAPI MCP servers.
context: fork
agent: sonnet
---

# Generate Swagger/OpenAPI Documentation

## 1. Context Collection
When asked to generate Swagger documentation for a specific file, module, or endpoints:
1. Examine the provided source code, focusing on route definitions, controllers, request parsing, and response formatting.
2. Identify all required data models, DTOs (Data Transfer Objects), and database schemas related to the endpoints.
3. Determine the expected HTTP methods, paths, path variables, query parameters, headers, and request body structures.
4. Review how errors are handled to document the error responses.

## 2. OpenAPI Specification Generation
Your primary goal is to generate strictly compliant **OpenAPI 3.0.x** (or 3.1.x) specification documents in **YAML** or **JSON** format.
*Note: This specification must be fully compliant so it can be parsed by an OpenAPI MCP Server.*

### Guidelines for Paths and Operations:
- Include a descriptive `summary`, `description`, and `operationId` for every endpoint. The `operationId` is critical as it will become the tool name if an MCP server uses this spec.
- Define `tags` to group related endpoints.
- Document all `parameters` (query, path, header) with strict types.

## 3. Mandatory Examples
**Crucial:** You must provide realistic, comprehensive examples for every request body and response using the `example` keyword. Without examples, AI agents attempting to use this API via MCP will struggle to format requests correctly.
- Provide examples for both successful responses (200, 201) and errors (400, 404, 500).

## 4. MCP Integration Awareness
If the user indicates they want to use this documentation to power an AI Agent or MCP Server, remind them of the following:

- **OpenAPI MCP Server:** Recommend the official OpenAPI MCP Server (`npx -y @modelcontextprotocol/server-openapi {path-to-yaml-or-url}`). It reads the generated YAML and automatically exposes your API back to the AI as native tool calls!
- **Testing:** Remind the user that once the YAML is saved, they can configure it in their Claude Desktop `mcp.json` (or similar host) to instantly test the endpoints with natural language.

## 5. Execution Steps
1. **Analyze:** Silently analyze the codebase/files provided by the user.
2. **Draft Entities:** Define the reusable schemas in `components.schemas` first.
3. **Draft Paths:** Map out the endpoints in the `paths` section.
4. **Refine Examples:** Populate schemas and responses with realistic data examples.
5. **Output:** Output the final YAML document within a single `yaml` markdown code block, and briefly mention how it can be used with an OpenAPI MCP Server.
