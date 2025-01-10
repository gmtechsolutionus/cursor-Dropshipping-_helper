/// <reference types="jest" />

import type {
	Task,
	TaskSequence,
	CodebaseSearch,
	ReadFile,
	RunTerminalCmd,
	ListDir,
	GrepSearch,
	EditFile,
	FileSearch,
	DeleteFile,
	Reapply,
	ParallelApply,
} from "../src";
import {
	createCodebaseSearchTask,
	createEditFileTask,
	createGrepSearchTask,
	createParallelApplyTask,
	createReadFileTask,
	createRunTerminalCmdTask,
	createListDirTask,
	createFileSearchTask,
	createDeleteFileTask,
	createReapplyTask,
	createTaskSequence,
} from "../src";

describe("Individual Task Creation", () => {
	it("should create a codebase search task", () => {
		const task = createCodebaseSearchTask({
			query: "find components",
			explanation: "search for components",
			target_directories: ["src"],
		});

		expect(task.name).toBe("codebase_search");
		expect((task.parameters as CodebaseSearch).query).toBe("find components");
		expect((task.parameters as CodebaseSearch).target_directories).toEqual([
			"src",
		]);
	});

	it("should create a read file task", () => {
		const task = createReadFileTask({
			relative_workspace_path: "src/index.ts",
			should_read_entire_file: true,
			start_line_one_indexed: 1,
			end_line_one_indexed_inclusive: 100,
			explanation: "read source file",
		});

		expect(task.name).toBe("read_file");
		expect((task.parameters as ReadFile).relative_workspace_path).toBe(
			"src/index.ts",
		);
		expect((task.parameters as ReadFile).should_read_entire_file).toBe(true);
	});

	it("should create a run terminal command task", () => {
		const task = createRunTerminalCmdTask({
			command: "npm test",
			is_background: false,
			require_user_approval: true,
			explanation: "run tests",
		});

		expect(task.name).toBe("run_terminal_cmd");
		expect((task.parameters as RunTerminalCmd).command).toBe("npm test");
		expect((task.parameters as RunTerminalCmd).is_background).toBe(false);
	});

	it("should create a list directory task", () => {
		const task = createListDirTask({
			relative_workspace_path: "src",
			explanation: "list source files",
		});

		expect(task.name).toBe("list_dir");
		expect((task.parameters as ListDir).relative_workspace_path).toBe("src");
	});

	it("should create a grep search task", () => {
		const task = createGrepSearchTask({
			query: "function",
			case_sensitive: true,
			include_pattern: "*.ts",
			explanation: "find functions",
		});

		expect(task.name).toBe("grep_search");
		expect((task.parameters as GrepSearch).query).toBe("function");
		expect((task.parameters as GrepSearch).case_sensitive).toBe(true);
	});

	it("should create an edit file task", () => {
		const task = createEditFileTask({
			target_file: "src/index.ts",
			instructions: "update exports",
			code_edit: "export const x = 1;",
			blocking: true,
		});

		expect(task.name).toBe("edit_file");
		expect((task.parameters as EditFile).target_file).toBe("src/index.ts");
		expect((task.parameters as EditFile).blocking).toBe(true);
	});

	it("should create a file search task", () => {
		const task = createFileSearchTask({
			query: "index",
			explanation: "find index files",
		});

		expect(task.name).toBe("file_search");
		expect((task.parameters as FileSearch).query).toBe("index");
	});

	it("should create a delete file task", () => {
		const task = createDeleteFileTask({
			target_file: "temp.ts",
			explanation: "remove temp file",
		});

		expect(task.name).toBe("delete_file");
		expect((task.parameters as DeleteFile).target_file).toBe("temp.ts");
	});

	it("should create a reapply task", () => {
		const task = createReapplyTask({
			target_file: "src/index.ts",
		});

		expect(task.name).toBe("reapply");
		expect((task.parameters as Reapply).target_file).toBe("src/index.ts");
	});

	it("should create a parallel apply task", () => {
		const task = createParallelApplyTask({
			edit_plan: "update exports",
			edit_regions: [
				{
					relative_workspace_path: "src/index.ts",
					start_line: 1,
					end_line: 100,
				},
			],
		});

		expect(task.name).toBe("parallel_apply");
		expect((task.parameters as ParallelApply).edit_plan).toBe("update exports");
		expect((task.parameters as ParallelApply).edit_regions).toHaveLength(1);
	});
});

describe("Complex Task Sequences", () => {
	it("should create a documentation task sequence", () => {
		const task: TaskSequence = {
			tasks: [
				createCodebaseSearchTask(
					{
						query: "Find NextJS project structure and main components",
						explanation: "Identify the core NextJS components and structure",
						target_directories: ["src", "app", "pages", "components"],
					},
					[
						createEditFileTask({
							target_file: "docs/nextjs_docs.mdx",
							instructions:
								"Create initial NextJS project documentation structure",
							code_edit: "# NextJS Project Documentation\n## Project Structure",
							blocking: true,
						}),
					],
				),
				createGrepSearchTask(
					{
						query: "export|function|const|interface|type|class",
						include_pattern: "*.{ts,tsx,js,jsx}",
						explanation: "Find all exported components and functions",
					},
					[
						createParallelApplyTask({
							edit_plan: "Document each component and function",
							edit_regions: [
								{
									relative_workspace_path: "docs/nextjs_docs.mdx",
									start_line: 1,
									end_line: 100,
								},
							],
						}),
					],
				),
			],
		};

		expect(task.tasks).toHaveLength(2);
		expect(task.tasks[0].name).toBe("codebase_search");
		expect(task.tasks[1].name).toBe("grep_search");
		expect(task.tasks[0].subtasks?.[0].name).toBe("edit_file");
		expect(task.tasks[1].subtasks?.[0].name).toBe("parallel_apply");
	});

	it("should create a file processing task sequence", () => {
		const task: TaskSequence = {
			tasks: [
				createListDirTask(
					{
						relative_workspace_path: "src",
						explanation: "List source files",
					},
					[
						createReadFileTask({
							relative_workspace_path: "src/index.ts",
							should_read_entire_file: true,
							start_line_one_indexed: 1,
							end_line_one_indexed_inclusive: 100,
							explanation: "Read index file",
						}),
						createGrepSearchTask({
							query: "export",
							include_pattern: "*.ts",
							explanation: "Find exports",
						}),
					],
				),
				createParallelApplyTask({
					edit_plan: "Update exports",
					edit_regions: [
						{
							relative_workspace_path: "src/index.ts",
							start_line: 1,
							end_line: 100,
						},
					],
				}),
			],
		};

		expect(task.tasks).toHaveLength(2);
		expect(task.tasks[0].name).toBe("list_dir");
		expect(task.tasks[0].subtasks).toHaveLength(2);
		expect(task.tasks[0].subtasks?.[0].name).toBe("read_file");
		expect(task.tasks[0].subtasks?.[1].name).toBe("grep_search");
		expect(task.tasks[1].name).toBe("parallel_apply");
	});

	it("should create a cleanup task sequence", () => {
		const task: TaskSequence = {
			tasks: [
				createFileSearchTask(
					{
						query: "temp",
						explanation: "Find temporary files",
					},
					[
						createDeleteFileTask({
							target_file: "temp.ts",
							explanation: "Remove temp file",
						}),
					],
				),
				createRunTerminalCmdTask({
					command: "npm run build",
					is_background: false,
					require_user_approval: true,
					explanation: "Rebuild project",
				}),
			],
		};

		expect(task.tasks).toHaveLength(2);
		expect(task.tasks[0].name).toBe("file_search");
		expect(task.tasks[0].subtasks?.[0].name).toBe("delete_file");
		expect(task.tasks[1].name).toBe("run_terminal_cmd");
	});
});
