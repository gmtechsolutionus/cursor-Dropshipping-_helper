/**
 * Cursor AI Tools List
 *
 * This file defines the interfaces for various tools that can be used in task sequences.
 * Each interface represents a specific tool with its configuration options:
 *
 * - CodebaseSearch: Search through codebase with specific queries
 * - ReadFile: Read contents of files with line number control
 * - RunTerminalCmd: Execute terminal commands with safety options
 * - ListDir: List directory contents
 * - GrepSearch: Perform grep-like text searches
 * - EditFile: Modify file contents with specific instructions
 * - FileSearch: Search for files by name or pattern
 * - DeleteFile: Remove files from the workspace
 * - Reapply: Reapply the changes made by the previous task
 * - ParallelApply: Apply changes to multiple files in parallel
 */

export interface CodebaseSearch {
	query: string;
	explanation?: string;
	target_directories?: string[];
}

export interface ReadFile {
	relative_workspace_path: string;
	should_read_entire_file: boolean;
	start_line_one_indexed: number;
	end_line_one_indexed_inclusive: number;
	explanation?: string;
}

export interface RunTerminalCmd {
	command: string;
	is_background: boolean;
	require_user_approval: boolean;
	explanation?: string;
}

export interface ListDir {
	relative_workspace_path: string;
	explanation?: string;
}

export interface GrepSearch {
	query: string;
	case_sensitive?: boolean;
	exclude_pattern?: string;
	include_pattern?: string;
	explanation?: string;
}

export interface EditFile {
	target_file: string;
	instructions: string;
	code_edit: string;
	blocking: boolean;
}

export interface FileSearch {
	query: string;
	explanation: string;
}

export interface DeleteFile {
	target_file: string;
	explanation?: string;
}

export interface Reapply {
	target_file: string;
}

export interface ParallelApply {
	edit_plan: string;
	edit_regions: Array<{
		relative_workspace_path: string;
		start_line?: number;
		end_line?: number;
	}>;
}

export interface Tools {
	codebase_search: CodebaseSearch;
	read_file: ReadFile;
	run_terminal_cmd: RunTerminalCmd;
	list_dir: ListDir;
	grep_search: GrepSearch;
	edit_file: EditFile;
	file_search: FileSearch;
	delete_file: DeleteFile;
	reapply: Reapply;
	parallel_apply: ParallelApply;
}

// Type definition for a task with infinite nesting capability
export interface Task {
	name: keyof Tools;
	parameters: Tools[keyof Tools];
	subtasks?: Task[];
}

// Type definition for a task sequence
export interface TaskSequence {
	tasks: Task[];
}

// example of use
const task: TaskSequence = {
	tasks: [
		{
			name: "codebase_search",
			parameters: { query: "login" },
			subtasks: [
				{
					name: "read_file",
					parameters: {
						relative_workspace_path: "src/app/api/auth/login/page.tsx",
						should_read_entire_file: true,
						start_line_one_indexed: 1,
						end_line_one_indexed_inclusive: 100,
					},
					subtasks: [
						{
							name: "grep_search",
							parameters: {
								query: "auth",
								case_sensitive: true,
							},
							subtasks: [
								{
									name: "edit_file",
									parameters: {
										target_file: "src/app/api/auth/login/page.tsx",
										instructions: "Update auth logic",
										code_edit: "// Edit content",
										blocking: true,
									},
								},
							],
						},
					],
				},
			],
		},
	],
};
console.log(task);
