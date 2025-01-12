export class order {
  constructor(market, side, quantity, user_id, order_id, filled, price, ioc) {
    if (price) price = parseFloat(price);
    if (quantity) quantity = parseFloat(quantity);
    if (isNaN(price) || isNaN(quantity)) {
      throw new Error("Invalid price or quantity");
    }
    if (filled) filled = parseFloat(filled);

    this.market = market || "";
    this.side = side || "";
    this.quantity = quantity || 0.0;
    this.user_id = user_id || "";
    this.order_id = order_id || "";
    this.filled = filled || 0.0;
    this.price = price || 0.0;
    this.cancelled = false;
    this.ioc = ioc || false;
  }
}

export class Fill {
  constructor(order_id, price, quantity, dealer_id, side) {
    if (price) price = parseFloat(price);
    if (quantity) quantity = parseFloat(quantity);
    this.order_id = order_id || "";
    this.price = price || 0.0;
    this.quantity = quantity || 0.0;
    this.dealer_id = dealer_id || "";
    this.side = side || "";
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
    this.heapifyUp();
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
      this.heapifyDown();
    }
    this.totalVolume -= minElement.quantity;
    return minElement;
  }

  heapifyDown() {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[index];
    while (true) {
      let leftChildIndex = 2 * index + 1; // Correcting the child index calculations
      let rightChildIndex = 2 * index + 2;
      let leftChild = this.heap[leftChildIndex];
      let rightChild = this.heap[rightChildIndex];
      let swap = null;

      if (leftChildIndex < length && this.comparator(leftChild, element)) {
        swap = leftChildIndex;
      }
      if (
        rightChildIndex < length &&
        this.comparator(rightChild, swap === null ? element : leftChild)
      ) {
        swap = rightChildIndex;
      }

      if (swap === null) break;

      // Swap the elements
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
