import { Math2D } from "./Math2D";

export type Vertex = { val: string; pos: { x: number; y: number } };

class Graph {
  graph: { [key: string]: Vertex[] } = {};
  vertices: { [key: string]: Vertex } = {};

  getPath(
    startVertex: string,
    current: string,
    path: Array<{
      parent: string;
      current: string;
    }>,
  ) {
    let ret: string[] = [];

    const getFullPath = (current: string) => {
      ret.push(current);

      let res = path.find((value) => value.current === current);

      if (res) {
        if (res.parent !== startVertex) {
          getFullPath(res.parent);
        } else {
          ret.push(res.parent);
        }
      }
    };

    getFullPath(current);

    return ret;
  }

  addEdge(
    u: { val: string; pos: { x: number; y: number } },
    v: { val: string; pos: { x: number; y: number } },
  ): void {
    if (!this.graph[u.val]) {
      this.graph[u.val] = [];
    }
    if (!this.graph[v.val]) {
      this.graph[v.val] = [];
    }

    this.graph[u.val].push(v);
    this.graph[v.val].push(u);

    this.vertices[u.val] = u;
    this.vertices[v.val] = v;
  }

  private bfs(startVertex: Vertex, nextVertex: Vertex): string[] {
    let ret: string[] = [];
    let cycles: string[][] = [];
    let startVisited: 0 | 1 | 2 = 0;

    const path: Array<{
      parent: string;
      current: string;
    }> = [];

    const visited: { [key: string]: boolean } = {};

    let queue: Vertex[] = [];
    const parent: { [key: string]: string } = {};

    parent[nextVertex.val] = startVertex.val;
    queue.push(nextVertex);

    path.push({
      parent: startVertex.val,
      current: nextVertex.val,
    });

    visited[startVertex.val] = true;
    visited[nextVertex.val] = true;

    while (queue.length > 0) {
      const current = queue.shift()!;

      let neighbors = this.graph[current.val];
      let sortedNeighbors = neighbors.sort((a, b) =>
        this.thetaSort(current, a, b),
      );

      for (const neighbor of sortedNeighbors) {
        if (neighbor.val === startVertex.val) {
          startVisited++;
        }

        if (!visited[neighbor.val]) {
          if (
            neighbor.val === startVertex.val &&
            current.val === nextVertex.val
          ) {
            visited[neighbor.val] = true;
            continue;
          }

          queue.push(neighbor);

          parent[neighbor.val] = current.val;

          path.push({
            parent: current.val,
            current: neighbor.val,
          });

          visited[neighbor.val] = true;
        } else if (startVertex.val === neighbor.val && startVisited === 2) {
          ret = this.getPath(startVertex.val, current.val, path);

          cycles[ret.length] = ret;
        }
      }
    }

    return ret;
  }

  private dfs(vertex: Vertex, visited: { [key: string]: boolean } = {}) {
    visited[vertex.val] = true;

    const neighbors = this.graph[vertex.val] || [];

    for (const neighbor of neighbors) {
      if (!visited[neighbor.val]) {
        this.dfs(neighbor, visited);
      }
    }
  }

  private thetaSort(current: Vertex, a: Vertex, b: Vertex) {
    let aDiff =
      (Math.atan2(a.pos.x, a.pos.x) * 180) / Math.PI -
      (Math.atan2(current.pos.x, current.pos.x) * 180) / Math.PI;

    let bDiff =
      (Math.atan2(b.pos.x, b.pos.x) * 180) / Math.PI -
      (Math.atan2(current.pos.x, current.pos.x) * 180) / Math.PI;

    return Math.abs(bDiff) - Math.abs(aDiff);
  }

  getCycles() {
    let allCycles: string[][] = [];

    const max = Object.keys(this.vertices).length;

    let _i = 0;
    while (_i < max) {
      let adjs = this.graph[Object.values(this.vertices)[_i].val];

      adjs.map((adj, index) => {
        allCycles.push(this.bfs(Object.values(this.vertices)[_i], adj));
      });

      _i++;
    }

    let result = this.removeDuplicate(allCycles);
    result = this.innerCycles(result);
    result = this.removeDuplicate(result);

    return result.filter((res) => res.length > 0);
  }

  innerCycles(cycles: string[][]) {
    let ret: string[][] = [];

    let _i = 0;
    while (_i < cycles.length) {
      let cycle = cycles[_i];

      let vertices = this.getVertexCycle(cycle);
      let hasChord = this.hasChord(vertices);
      let hasInnerCycle = this.hasChord(vertices);

      if (hasChord) {
        ret.push(...hasChord.map((h) => h.map((_h) => _h.val)));
      } else {
        ret.push(cycle);
      }

      _i++;
    }

    return ret;
  }

  private removeDuplicate(cycles: string[][]) {
    let duplicatedRemove: string[][] = [];

    let _i = 0;
    while (_i < cycles.length) {
      cycles.map((cycle) => {
        let vertices = this.getVertexCycle(cycle);

        if (
          !duplicatedRemove.find(
            (c) => [...c].sort().join("") === [...cycle].sort().join(""),
          )
        ) {
          let order = this.restoreOrder(cycle);

          if (order) {
            duplicatedRemove.push(order);
          }
        }
      });

      _i++;
    }

    return duplicatedRemove;
  }

  hasChord(cycle: Vertex[], split: boolean = true) {
    let ret: Vertex[][] | false = false;

    for (const node of cycle) {
      if (ret) break;

      for (const neighbor of this.graph[node.val]) {
        if (ret) break;

        let res = cycle.find((ver) => ver.val === neighbor.val);

        if (!res && this.isVertexInsideCycle(neighbor, cycle)) {
          let res = this.isChordCutCycle(node, neighbor, cycle);
          if (res) {
            ret = res;
            break;
          }
        }
      }
    }

    return ret;
  }

  private isVertexInsideCycle(vertex: Vertex, cycle: Vertex[]) {
    let inside = false;
    const { x, y } = vertex.pos;

    for (let i = 0, j = cycle.length - 1; i < cycle.length; j = i++) {
      const xi = cycle[i].pos.x;
      const yi = cycle[i].pos.y;
      const xj = cycle[j].pos.x;
      const yj = cycle[j].pos.y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  private isChordCutCycle(start: Vertex, vertex: Vertex, cycle: Vertex[]) {
    let cutCycles: Vertex[][] | false = false;

    let cutVertices: Vertex[] = [];
    let end: null | Vertex = null;
    let visited: string[] = [];
    visited.push(start.val);

    const getNext = (ver: Vertex) => {
      if (end) return;

      visited.push(ver.val);
      cutVertices.push(ver);

      for (const neighbor of this.graph[ver.val]) {
        if (end) break;
        if (neighbor.val === start.val) continue;
        if (visited.includes(neighbor.val)) continue;

        let res = cycle.find((v) => v.val === neighbor.val);

        if (res && res.val !== start.val) {
          end = neighbor;

          break;
        } else {
          getNext(neighbor);
        }
      }
    };

    getNext(vertex);

    if (end) {
      let index = cycle.findIndex((ver) => ver.val === start.val);
      let prevV = cycle[(index + 1) % cycle.length];
      let nextV = cycle[index - 1];

      if (prevV && nextV) {
        let firstPearceOfCycle = this.getVerticesFromTo(
          cycle,
          start,
          nextV,
          end,
        );
        let secondPearceOfCycle = this.getVerticesFromTo(
          cycle,
          start,
          prevV,
          end,
        );

        firstPearceOfCycle.push(...cutVertices);
        secondPearceOfCycle.push(...cutVertices);

        cutCycles = [];
        cutCycles.push(firstPearceOfCycle);
        cutCycles.push(secondPearceOfCycle);
      }
    }

    return cutCycles;
  }

  isChordFormInnerCycle(cycle: Vertex[]) {
    let innerCycle: string[] = [];
    for (const node of cycle) {
      for (const neighbor of this.graph[node.val]) {
        let isCycleVertex = cycle.find((ver) => ver.val === neighbor.val);

        if (!isCycleVertex && this.isVertexInsideCycle(neighbor, cycle)) {
          let didCut = this.isChordCutCycle(node, neighbor, cycle);
          if (!didCut) {
            innerCycle = this.bfs(neighbor, neighbor);
          }
        }
      }
    }

    return innerCycle;
  }

  getInnerCycles(cycle: Vertex[]) {
    let innerVertices: Vertex[] = [];

    Object.values(this.vertices).map((ver) => {
      if (this.isVertexInsideCycle(ver, cycle)) {
        let isVertexOnCycle = cycle.find((v) => v.val === ver.val);

        if (!isVertexOnCycle) {
          innerVertices.push(ver);
        }
      }
    });

    if (innerVertices.length > 2) {
      let innerCycle = this.bfs(innerVertices[0], innerVertices[1]);

      const hasIntersections = cycle.filter((value) =>
        innerCycle.includes(value.val),
      );

      if (hasIntersections.length === 0) {
        return innerCycle;
      }
    }

    return [];
  }

  private restoreOrder(cycle: string[]) {
    let ret: string[] = [];
    let start = cycle[0];

    const getNext = (vertex: string) => {
      let adj = this.graph[vertex];
      if (!adj) return;
      ret.push(vertex);

      for (let neighbor of adj) {
        if (!ret.includes(neighbor.val) && cycle.includes(neighbor.val)) {
          getNext(neighbor.val);
          break;
        }
      }
    };

    getNext(start);

    return ret.length > 0 ? ret : null;
  }

  getVertexCycle(cycle: string[]): Vertex[] {
    let ret: Vertex[] = [];

    cycle.map((v) => {
      let vertex = this.vertices[v];

      ret.push(vertex);
    });

    return ret;
  }

  private getVerticesFromTo(
    cycle: Vertex[],
    parent: Vertex,
    start: Vertex,
    end: Vertex,
  ) {
    if (start.val === end.val) return [start, parent];

    let ret: Vertex[] = [];
    let visited: string[] = [];

    visited.push(parent.val);
    ret.push(parent);

    let done: boolean = false;
    const getNext = (ver: Vertex) => {
      if (done) return;

      visited.push(ver.val);
      ret.push(ver);

      for (const neighbor of this.graph[ver.val]) {
        if (done) break;
        if (neighbor.val === start.val) continue;
        if (visited.includes(neighbor.val)) continue;

        if (neighbor.val === end.val) {
          ret.push(neighbor);
          done = true;
          break;
        } else {
          getNext(neighbor);
        }
      }
    };

    getNext(start);

    return ret;
  }
}

export { Graph };
