import { Math2D } from "../app/system/utils/Math2D";

type Vertex = { val: string; pos: { x: number; y: number } };

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
    // console.log("cycles", cycles);

    return ret;
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

    return result.filter((res) => res.length > 0);
  }

  private dfs(
    start: Vertex,
    parent: Vertex,
    current: Vertex,
    visited: { [key: string]: boolean },
    cycles: string[],
  ): boolean {
    visited[parent.val] = true;
    visited[current.val] = true;
    cycles.push(current.val);

    let neighbors = this.graph[current.val];
    let sortedNeighbors = neighbors.sort((a, b) =>
      this.thetaSort(current, a, b),
    );

    for (const neighbor of sortedNeighbors) {
      if (!visited[neighbor.val]) {
        if (this.dfs(start, current, neighbor, visited, cycles)) {
          return true;
        }
      } else if (neighbor.val !== parent.val && neighbor.val === start.val) {
        cycles.push(start.val);
        // If the neighbor is visited and not the parent, then there is a cycle
        return true;
      }
    }

    return false;
  }

  getCyclesNew() {
    let allCycles: string[][] = [];

    const max = Object.keys(this.vertices).length;

    let _i = 0;
    while (_i < max) {
      let adjs = this.graph[Object.values(this.vertices)[_i].val];

      adjs.map((adj, index) => {
        let visited: { [key: string]: boolean } = {};

        let cycles: string[] = [];
        let ret = this.dfs(
          Object.values(this.vertices)[_i],
          Object.values(this.vertices)[_i],
          adj,
          visited,
          cycles,
        );
        if (ret) {
          allCycles.push(cycles);
        }
      });

      _i++;
    }

    let result = this.removeDuplicate(allCycles);

    return result.filter((res) => res.length > 0);
    // return 0;
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
          ) &&
          !this.hasChord(vertices)
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

  private hasChord(cycle: Vertex[]) {
    let ret = false;

    for (const node of cycle) {
      if (ret) break;

      for (const neighbor of this.graph[node.val]) {
        if (ret) break;

        let res = cycle.find((ver) => ver.val === neighbor.val);

        if (!res && this.isInsidePolygon(neighbor, cycle)) {
          ret = true;
          break;
        }
      }
    }

    return ret;
  }

  private isInsidePolygon(vertex: Vertex, polygon: Vertex[]) {
    let inside = false;
    const { x, y } = vertex.pos;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].pos.x;
      const yi = polygon[i].pos.y;
      const xj = polygon[j].pos.x;
      const yj = polygon[j].pos.y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  private isInsideCycle(vertex: Vertex, polygon: Vertex[]) {
    let inside = false;
    const { x, y } = vertex.pos;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].pos.x;
      const yi = polygon[i].pos.y;
      const xj = polygon[j].pos.x;
      const yj = polygon[j].pos.y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
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

  private getVertexCycle(cycle: string[]): Vertex[] {
    let ret: Vertex[] = [];

    cycle.map((v) => {
      let vertex = this.vertices[v];

      ret.push(vertex);
    });

    return ret;
  }
}

export { Graph };
