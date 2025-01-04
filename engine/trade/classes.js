export class order {
  constructor(market, side, quantity, user_id, order_id, filled, price) {
    this.market = market || "";
    this.side = side || "";
    this.quantity = quantity || "";
    this.user_id = user_id || "";
    this.order_id = order_id || "";
    this.filled = filled || "0";
    this.price = price || "";
    this.cancelled = false;
  }
}

export class Fill {
  constructor(order_id, price, quantity, dealer_id) {
    this.order_id = order_id || "";
    this.price = price || "";
    this.quantity = quantity || "";
    this.dealer_id = dealer_id || "";
  }
}

export class Heap {
  constructor(comparator) {
    this.heap = [];
    this.comparator = comparator;
    this.totalVolume = 0;
  }

  push(order) {
    this.heap.push(order);
    this.heap.heapifyUp();
    this.totalVolume += order.quantity;
  }
  heapifyUp() {
    let index = this.heap.length - 1;
    const element = this.heap[index];
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.comparator(element, parent) === false) {
        break;
      }
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  pop() {
    if (this.heap.length <= 0) {
      return null;
    }
    const minElement = this.heap[0];
    const lastElement = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = lastElement;
      this.heap.heapifyDown();
    }
    this.totalVolume -= minElement.quantity;
    return minElement;
  }

  heapifyDown() {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[index];
    while (true) {
      let leftChildIndex = index * 2;
      let rightChildIndex = index * 2 + 1;
      let leftchild = this.heap[leftChildIndex];
      let rightChild = this.heap[rightChildIndex];
      let swap = null;
      if (leftChildIndex < length) {
        if (this.comparator(leftchild, element)) {
          swap = leftChildIndex;
        }
      }
      if (rightChildIndex < length) {
        if (swap == null || this.comparator(rightChild, this.heap[swap])) {
          swap = rightChildIndex;
        }
      }
      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = element;
  }
}

export function minComparator(a, b) {
  if (a.price <= b.price) return true;
  return false;
}
export function maxComparator(a, b) {
  if (a.price >= b.price) return true;
  return false;
}
