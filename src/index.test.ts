import {
	createCodebaseSearchTask,
	createReadFileTask,
	createRunTerminalCmdTask,
	createListDirTask,
	createGrepSearchTask,
	createEditFileTask,
	createFileSearchTask,
	createDeleteFileTask,
	createReapplyTask,
	createParallelApplyTask,
	createTaskSequence,
	type Task,
	type TaskSequence,
} from "./index";

describe("Task Creation Functions", () => {
	test("createCodebaseSearchTask creates valid task", () => {
		const task = createCodebaseSearchTask({
			query: "test query",
			explanation: "test explanation",
		});

		expect(task).toEqual({
			name: "codebase_search",
			parameters: {
				query: "test query",
				explanation: "test explanation",
			},
		});
	});

	test("createReadFileTask creates valid task", () => {
		const task = createReadFileTask({
			relative_workspace_path: "test/path",
			should_read_entire_file: true,
			start_line_one_indexed: 1,
			end_line_one_indexed_inclusive: 10,
			explanation: "test explanation",
		});

		expect(task).toEqual({
			name: "read_file",
			parameters: {
				relative_workspace_path: "test/path",
				should_read_entire_file: true,
				start_line_one_indexed: 1,
				end_line_one_indexed_inclusive: 10,
				explanation: "test explanation",
			},
		});
	});

	test("createRunTerminalCmdTask creates valid task", () => {
		const task = createRunTerminalCmdTask({
			command: "echo test",
			is_background: false,
			require_user_approval: true,
			explanation: "test explanation",
		});

		expect(task).toEqual({
			name: "run_terminal_cmd",
			parameters: {
				command: "echo test",
				is_background: false,
				require_user_approval: true,
				explanation: "test explanation",
			},
		});
	});

	test("createTaskSequence creates valid sequence", () => {
		const tasks: Task[] = [
			createCodebaseSearchTask({ query: "test" }),
			createReadFileTask({
				relative_workspace_path: "test",
				should_read_entire_file: true,
				start_line_one_indexed: 1,
				end_line_one_indexed_inclusive: 10,
			}),
		];

		const sequence = createTaskSequence(tasks);
		expect(sequence).toEqual({ tasks });
	});

	test("tasks support subtasks", () => {
		const subtask = createListDirTask({ relative_workspace_path: "test" });
		const mainTask = createCodebaseSearchTask({ query: "test" }, [subtask]);

		expect(mainTask.subtasks).toHaveLength(1);
		expect(mainTask.subtasks?.[0]).toEqual(subtask);
	});

	test("createParallelApplyTask creates valid task", () => {
		const task = createParallelApplyTask({
			edit_plan: "test plan",
			edit_regions: [
				{
					relative_workspace_path: "test/path",
					start_line: 1,
					end_line: 10,
				},
			],
		});

		expect(task).toEqual({
			name: "parallel_apply",
			parameters: {
				edit_plan: "test plan",
				edit_regions: [
					{
						relative_workspace_path: "test/path",
						start_line: 1,
						end_line: 10,
					},
				],
			},
		});
	});
});
