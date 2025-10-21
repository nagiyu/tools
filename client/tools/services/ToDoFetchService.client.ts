import ErrorUtil from '@common/utils/ErrorUtil';
import { ToDoData } from '@tools/interfaces/ToDoData';

export default class ToDoFetchService {
    /**
     * Fetch all ToDo items for a specific terminal
     * @param terminalId The terminal ID to fetch todos for
     * @returns Promise with array of ToDo items
     */
    public static async fetchTodos(terminalId: string): Promise<ToDoData[]> {
        if (!terminalId) {
            return [];
        }

        try {
            const response = await fetch(`/api/todo?terminalId=${terminalId}`);

            if (!response.ok) {
                ErrorUtil.throwError('Failed to fetch ToDo items');
            }

            const { todos } = await response.json();
            return todos;
        } catch (error) {
            ErrorUtil.throwError('Error fetching ToDo items', error);
        }
    }

    /**
     * Create a new ToDo item
     * @param terminalId The terminal ID
     * @param item The ToDo item data
     * @returns Promise with the created ToDo item
     */
    public static async createTodo(terminalId: string, item: Partial<ToDoData>): Promise<ToDoData> {
        try {
            const response = await fetch('/api/todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    terminalId,
                    title: item.title,
                    dueDate: item.dueDate,
                    priority: item.priority,
                }),
            });

            if (!response.ok) {
                ErrorUtil.throwError('Failed to create ToDo item');
            }

            const { todo } = await response.json();
            return todo;
        } catch (error) {
            ErrorUtil.throwError('Error creating ToDo item', error);
        }
    }

    /**
     * Update an existing ToDo item
     * @param terminalId The terminal ID
     * @param item The ToDo item data with id
     * @returns Promise with the updated ToDo item
     */
    public static async updateTodo(terminalId: string, item: ToDoData): Promise<ToDoData> {
        try {
            const response = await fetch('/api/todo', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id,
                    terminalId,
                    title: item.title,
                    dueDate: item.dueDate,
                    priority: item.priority,
                }),
            });

            if (!response.ok) {
                ErrorUtil.throwError('Failed to update ToDo item');
            }

            const { todo } = await response.json();
            return todo;
        } catch (error) {
            ErrorUtil.throwError('Error updating ToDo item', error);
        }
    }

    /**
     * Delete a ToDo item
     * @param terminalId The terminal ID
     * @param id The ToDo item ID to delete
     * @returns Promise that resolves when deletion is complete
     */
    public static async deleteTodo(terminalId: string, id: string): Promise<void> {
        try {
            const response = await fetch('/api/todo', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    terminalId,
                }),
            });

            if (!response.ok) {
                ErrorUtil.throwError('Failed to delete ToDo item');
            }
        } catch (error) {
            ErrorUtil.throwError('Error deleting ToDo item', error);
        }
    }
}
