/**
 * Cursor AI Tools List
 *
 * This file defines the interfaces for various tools that can be used in task sequences.
 * Each interface represents a specific tool with its configuration options.
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

// Helper functions to create tasks with type safety
export function createCodebaseSearchTask(
	parameters: CodebaseSearch,
	subtasks?: Task[],
): Task {
	return {
		name: "codebase_search",
		parameters,
		subtasks,
	};
}

export function createReadFileTask(
	parameters: ReadFile,
	subtasks?: Task[],
): Task {
	return {
		name: "read_file",
		parameters,
		subtasks,
	};
}

export function createRunTerminalCmdTask(
	parameters: RunTerminalCmd,
	subtasks?: Task[],
): Task {
	return {
		name: "run_terminal_cmd",
		parameters,
		subtasks,
	};
}

export function createListDirTask(
	parameters: ListDir,
	subtasks?: Task[],
): Task {
	return {
		name: "list_dir",
		parameters,
		subtasks,
	};
}

export function createGrepSearchTask(
	parameters: GrepSearch,
	subtasks?: Task[],
): Task {
	return {
		name: "grep_search",
		parameters,
		subtasks,
	};
}

export function createEditFileTask(
	parameters: EditFile,
	subtasks?: Task[],
): Task {
	return {
		name: "edit_file",
		parameters,
		subtasks,
	};
}

export function createFileSearchTask(
	parameters: FileSearch,
	subtasks?: Task[],
): Task {
	return {
		name: "file_search",
		parameters,
		subtasks,
	};
}

export function createDeleteFileTask(
	parameters: DeleteFile,
	subtasks?: Task[],
): Task {
	return {
		name: "delete_file",
		parameters,
		subtasks,
	};
}

export function createReapplyTask(
	parameters: Reapply,
	subtasks?: Task[],
): Task {
	return {
		name: "reapply",
		parameters,
		subtasks,
	};
}

export function createParallelApplyTask(
	parameters: ParallelApply,
	subtasks?: Task[],
): Task {
	return {
		name: "parallel_apply",
		parameters,
		subtasks,
	};
}

// Task sequence creator
export function createTaskSequence(tasks: Task[]): TaskSequence {
	return { tasks };
}

// Commons command
export const commands = {
	file_analysis: "Analyze the file.",
	file_issues: "Find issues in the file.",
	file_refactor: "Refactor the file.",
	file_improve: "Improve the file.",
	file_optimize: "Optimize the file.",
	file_debug: "Debug the file.",

	// Think Related
	think_deep: "Think deeply about the file.",
	think_refactor: "Think about refactoring the file.",
	think_improve: "Think about improving the file.",
	think_optimize: "Think about optimizing the file.",

	// sequence related
	do_in_sequence: "Do the sequence of tasks.",
	do_in_parallel: "Do the tasks in parallel.",

	// suggestion related
	suggest_next_task: "Suggest the next task.",
	suggest_idea: "Suggest an idea.",

	// plan related
	plan_task: "Plan the task.",
	plan_improve: "Plan the improvement.",

	// bug related
	bug_find: "Find potential bugs in the file.",
	bug_fix: "Fix the bugs in the file.",
};
