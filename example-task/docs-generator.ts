import type { TaskSequence } from "../src";

export const task102: TaskSequence = {
	tasks: [
		{
			name: "list_dir",
			parameters: {
				relative_workspace_path: "src",
				explanation: "List source files",
			},
			subtasks: [
				{
					name: "read_file",
					parameters: {
						relative_workspace_path: "src/index.ts",
						should_read_entire_file: true,
						start_line_one_indexed: 1,
						end_line_one_indexed_inclusive: 100,
						explanation: "Read index file",
					},
				},
				{
					name: "grep_search",
					parameters: {
						query: "export",
						include_pattern: "*.ts",
						explanation: "Find exports",
					},
				},
			],
		},
		{
			name: "parallel_apply",
			parameters: {
				edit_plan: "Update exports documentation",
				edit_regions: [
					{
						relative_workspace_path: "src/index.ts",
						start_line: 1,
						end_line: 100,
					},
					{
						relative_workspace_path: "docs/api.md",
						start_line: 1,
						end_line: 50,
					},
				],
			},
		},
		{
			name: "codebase_search",
			parameters: {
				query: "Find React components",
				explanation: "Looking for React components in the codebase",
				target_directories: ["src/components"],
			},
			subtasks: [
				{
					name: "edit_file",
					parameters: {
						target_file: "docs/components.md",
						instructions: "Document the components",
						code_edit: "# Components Documentation\n\n// ... existing code ...",
						blocking: true,
					},
				},
			],
		},
	],
};
