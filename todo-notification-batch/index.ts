/**
 * ToDo Notification Batch Lambda Function
 * 
 * This Lambda function is triggered by EventBridge every hour to send
 * push notifications for ToDo items that are due today.
 * 
 * Processing Flow:
 * 1. Get current hour and today's date
 * 2. Retrieve all ToDo items due today
 * 3. Group ToDo items by TerminalID
 * 4. For each terminal, check notification settings
 * 5. If notifications are enabled and it's the configured hour, send notification
 */

import { Handler, ScheduledEvent, Context } from 'aws-lambda';
import ToDoService from '@tools/services/ToDoService';
import NotificationSettingAccessor from '@tools/accessors/NotificationSettingAccessor';
import { ToDoData } from '@tools/interfaces/ToDoData';
import { NotificationSettingRecord } from '@tools/interfaces/NotificationSettingRecord';

/**
 * Response interface for the Lambda function
 */
interface BatchNotificationResponse {
  statusCode: number;
  body: string;
  processedTerminals?: number;
  notificationsSent?: number;
}

/**
 * Format current date as YYYY-MM-DD
 * @param date - Date object to format
 * @param timezone - Timezone string (e.g., "Asia/Tokyo")
 * @returns Formatted date string
 */
export function formatDate(date: Date, timezone: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  };
  const parts = new Intl.DateTimeFormat('ja-JP', options).formatToParts(date);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

/**
 * Get current hour in the specified timezone
 * @param date - Date object
 * @param timezone - Timezone string (e.g., "Asia/Tokyo")
 * @returns Current hour (0-23)
 */
export function getCurrentHour(date: Date, timezone: string): number {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    hour12: false,
    timeZone: timezone,
  };
  const hourString = new Intl.DateTimeFormat('ja-JP', options).format(date);
  return parseInt(hourString, 10);
}

/**
 * Group ToDo items by TerminalID
 * @param todos - Array of ToDo data
 * @returns Map of TerminalID to array of ToDo data
 */
export function groupByTerminalId(todos: ToDoData[]): Map<string, ToDoData[]> {
  const grouped = new Map<string, ToDoData[]>();

  for (const todo of todos) {
    const terminalTodos = grouped.get(todo.terminalId) || [];
    terminalTodos.push(todo);
    grouped.set(todo.terminalId, terminalTodos);
  }

  return grouped;
}

/**
 * Build notification message from ToDo items
 * @param todos - Array of ToDo data
 * @returns Object containing title and body for notification
 */
export function buildNotificationMessage(todos: ToDoData[]): { title: string; body: string } {
  const count = todos.length;
  const title = `本日のToDo (${count}件)`;
  
  const todoList = todos
    .map(todo => `- 【${todo.priority}】${todo.title}`)
    .join('\n');
  
  return { title, body: todoList };
}

/**
 * Check if notification should be sent for the given settings
 * @param settings - Notification settings record (may be null if not configured)
 * @param currentHour - Current hour in the user's timezone
 * @returns true if notification should be sent
 */
export function shouldSendNotification(
  settings: NotificationSettingRecord | null,
  currentHour: number
): boolean {
  // If no settings exist, don't send notification
  if (!settings) {
    return false;
  }

  // Check if notifications are enabled and it's the configured hour
  return settings.Enabled && settings.NotificationHour === currentHour;
}

/**
 * Main Lambda handler function
 * Triggered by EventBridge every hour to process batch notifications
 * 
 * @param _event - EventBridge scheduled event (unused but required by Lambda interface)
 * @param _context - Lambda context (unused but required by Lambda interface)
 * @returns Response with status and statistics
 */
export const handler: Handler<ScheduledEvent, BatchNotificationResponse> = async (
  _event: ScheduledEvent,
  _context: Context
): Promise<BatchNotificationResponse> => {
  console.log('Starting ToDo batch notification processing');

  try {
    const todoService = new ToDoService(false); // Disable cache for batch processing
    const notificationSettingAccessor = new NotificationSettingAccessor();

    // Get current date and time
    const now = new Date();
    const defaultTimezone = 'Asia/Tokyo';
    const today = formatDate(now, defaultTimezone);
    
    console.log(`Processing notifications for date: ${today}`);

    // Get all ToDo items due today
    const todosToday = await todoService.getByDueDate(today);
    console.log(`Found ${todosToday.length} ToDo items due today`);

    if (todosToday.length === 0) {
      return {
        statusCode: 200,
        body: 'No ToDo items due today',
        processedTerminals: 0,
        notificationsSent: 0,
      };
    }

    // Group ToDo items by TerminalID
    const todosByTerminal = groupByTerminalId(todosToday);
    console.log(`Processing ${todosByTerminal.size} terminals`);

    let notificationsSent = 0;

    // Process each terminal
    for (const [terminalId, todos] of todosByTerminal) {
      try {
        // Get notification settings for this terminal
        const settings = await notificationSettingAccessor.getByTerminalId(terminalId);
        
        // Get current hour in the user's timezone
        const timezone = settings?.Timezone || defaultTimezone;
        const currentHour = getCurrentHour(now, timezone);
        
        console.log(`Terminal ${terminalId}: hour=${currentHour}, settings=${JSON.stringify(settings)}`);

        // Check if we should send notification
        if (shouldSendNotification(settings, currentHour)) {
          const { title, body } = buildNotificationMessage(todos);
          
          // TODO: Send push notification using NotificationService
          // This will be implemented when the push notification infrastructure is available
          // For now, we log the notification that would be sent
          console.log(`Would send notification to ${terminalId}:`, { title, body });
          
          notificationsSent++;
        }
      } catch (terminalError) {
        // Log error but continue processing other terminals
        console.error(`Error processing terminal ${terminalId}:`, terminalError);
      }
    }

    const response: BatchNotificationResponse = {
      statusCode: 200,
      body: 'Success',
      processedTerminals: todosByTerminal.size,
      notificationsSent,
    };

    console.log('Batch notification processing completed:', response);
    return response;

  } catch (error) {
    console.error('Batch notification error:', error);
    return {
      statusCode: 500,
      body: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
