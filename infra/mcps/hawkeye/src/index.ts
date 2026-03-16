export default {
	async fetch(_request: Request, _env: Env): Promise<Response> {
		return new Response("Hawkeye MCP — coming soon", {
			headers: { "content-type": "text/plain" },
		});
	},
} satisfies ExportedHandler<Env>;

type Env = Record<string, unknown>;
