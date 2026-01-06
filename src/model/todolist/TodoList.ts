export interface TodoList {
  items: TodoListItem[];
}

export interface TodoListItem {
  id: string; // t.ex. "sie-import"
  arsredovisningId?: string; // För att koppla objektet till en specifik årsredovisning
  title: string;
  description?: string;
  timestamp: number;
  tasks: TodoListItemTask[];
}

export interface TodoListItemTask {
  text: string;
  complete: boolean;
}

/**
 * Lägger till en post i att-åtgärda-listan. Om en post med samma ID redan finns
 * tas den bort först.
 *
 * @param list - Att-åtgärda-listan som posten ska läggas till i
 * @param item - Posten som ska läggas till
 */
export function addTodoListItem(list: TodoList, item: TodoListItem): void {
  // Ta bort eventuell existerande post med samma ID
  removeTodoListItem(list, item.id);

  // Lägg till den nya posten
  list.items.push(item);
}

/**
 * Tar bort en post från att-åtgärda-listan baserat på dess ID.
 *
 * @param list - Att-åtgärda-listan som posten ska tas bort från
 * @param id - ID för posten som ska tas bort
 */
export function removeTodoListItem(list: TodoList, id: string): void {
  const existingItemIndex = list.items.findIndex((item) => item.id === id);
  if (existingItemIndex !== -1) {
    list.items.splice(existingItemIndex, 1);
  }
}

/**
 * Rensar att-åtgärda-listan.
 *
 * @param list - Att-åtgärda-listan som ska rensas
 */
export function clearTodoList(list: TodoList): void {
  list.items = [];
}
