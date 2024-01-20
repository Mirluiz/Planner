import { Math2D } from "./Math2D";

export interface Vertex {
  uuid: string;
  position: { x: number; y: number };
}

class Graph {
  graph: { [key: string]: Vertex[] } = {};
  vertices: { [key: string]: Vertex } = {};

  getPath(
    startVertex: string,
    current: string,
    path: Array<{
      parent: string;
      current: string;
    }>
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
    u: { uuid: string; position: { x: number; y: number } },
    v: { uuid: string; position: { x: number; y: number } }
  ): void {
    if (!this.graph[u.uuid]) {
      this.graph[u.uuid] = [];
    }
    if (!this.graph[v.uuid]) {
      this.graph[v.uuid] = [];
    }

    this.graph[u.uuid].push(v);
    this.graph[v.uuid].push(u);

    this.vertices[u.uuid] = u;
    this.vertices[v.uuid] = v;
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

    parent[nextVertex.uuid] = startVertex.uuid;
    queue.push(nextVertex);

    path.push({
      parent: startVertex.uuid,
      current: nextVertex.uuid,
    });

    visited[startVertex.uuid] = true;
    visited[nextVertex.uuid] = true;

    while (queue.length > 0) {
      const current = queue.shift()!;

      let neighbors = this.graph[current.uuid];
      let sortedNeighbors = neighbors.sort((a, b) =>
        this.thetaSort(current, a, b)
      );

      for (const neighbor of sortedNeighbors) {
        if (neighbor.uuid === startVertex.uuid) {
          startVisited++;
        }

        if (!visited[neighbor.uuid]) {
          if (
            neighbor.uuid === startVertex.uuid &&
            current.uuid === nextVertex.uuid
          ) {
            visited[neighbor.uuid] = true;
            continue;
          }

          queue.push(neighbor);

          parent[neighbor.uuid] = current.uuid;

          path.push({
            parent: current.uuid,
            current: neighbor.uuid,
          });

          visited[neighbor.uuid] = true;
        } else if (startVertex.uuid === neighbor.uuid && startVisited === 2) {
          ret = this.getPath(startVertex.uuid, current.uuid, path);

          cycles[ret.length] = ret;
        }
      }
    }

    return ret;
  }

  private dfs(vertex: Vertex, visited: { [key: string]: boolean } = {}) {
    visited[vertex.uuid] = true;

    const neighbors = this.graph[vertex.uuid] || [];

    for (const neighbor of neighbors) {
      if (!visited[neighbor.uuid]) {
        this.dfs(neighbor, visited);
      }
    }
  }

  private thetaSort(current: Vertex, a: Vertex, b: Vertex) {
    let aDiff =
      (Math.atan2(a.position.x, a.position.x) * 180) / Math.PI -
      (Math.atan2(current.position.x, current.position.x) * 180) / Math.PI;

    let bDiff =
      (Math.atan2(b.position.x, b.position.x) * 180) / Math.PI -
      (Math.atan2(current.position.x, current.position.x) * 180) / Math.PI;

    return Math.abs(bDiff) - Math.abs(aDiff);
  }

  getCycles() {
    let allCycles: string[][] = [];

    const max = Object.keys(this.vertices).length;

    let _i = 0;
    while (_i < max) {
      let adjs = this.graph[Object.values(this.vertices)[_i].uuid];

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
        ret.push(...hasChord.map((h) => h.map((_h) => _h.uuid)));
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
            (c) => [...c].sort().join("") === [...cycle].sort().join("")
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

      for (const neighbor of this.graph[node.uuid]) {
        if (ret) break;

        let res = cycle.find((ver) => ver.uuid === neighbor.uuid);

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
    const { x, y } = vertex.position;

    for (let i = 0, j = cycle.length - 1; i < cycle.length; j = i++) {
      const xi = cycle[i].position.x;
      const yi = cycle[i].position.y;
      const xj = cycle[j].position.x;
      const yj = cycle[j].position.y;

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
    visited.push(start.uuid);

    const getNext = (ver: Vertex) => {
      if (end) return;

      visited.push(ver.uuid);
      cutVertices.push(ver);

      for (const neighbor of this.graph[ver.uuid]) {
        if (end) break;
        if (neighbor.uuid === start.uuid) continue;
        if (visited.includes(neighbor.uuid)) continue;

        let res = cycle.find((v) => v.uuid === neighbor.uuid);

        if (res && res.uuid !== start.uuid) {
          end = neighbor;

          break;
        } else {
          getNext(neighbor);
        }
      }
    };

    getNext(vertex);

    if (end) {
      let index = cycle.findIndex((ver) => ver.uuid === start.uuid);
      let prevV = cycle[(index + 1) % cycle.length];
      let nextV = cycle[index - 1];

      if (prevV && nextV) {
        let firstPearceOfCycle = this.getVerticesFromTo(
          cycle,
          start,
          nextV,
          end
        );
        let secondPearceOfCycle = this.getVerticesFromTo(
          cycle,
          start,
          prevV,
          end
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
      for (const neighbor of this.graph[node.uuid]) {
        let isCycleVertex = cycle.find((ver) => ver.uuid === neighbor.uuid);

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

  getInnerCycles(cycle: Vertex[]): string[][] {
    let cycles: string[][] = [];

    const getInner = (cycle: Vertex[], vertices: Vertex[]) => {
      let innerVertices: Vertex[] = [];

      vertices.map((ver) => {
        if (this.isVertexInsideCycle(ver, cycle)) {
          let isVertexOnCycle = cycle.find((v) => v.uuid === ver.uuid);

          if (!isVertexOnCycle) {
            innerVertices.push(ver);
          }
        }
      });

      if (innerVertices.length > 2) {
        let innerCycle = this.bfs(innerVertices[0], innerVertices[1]);

        const hasIntersections = cycle.filter((value) =>
          innerCycle.includes(value.uuid)
        );

        if (hasIntersections.length === 0) {
          cycles.push(innerCycle);
        }

        let remainingVertices = innerVertices.filter(
          (value) => !innerCycle.includes(value.uuid)
        );

        if (remainingVertices.length > 2) {
          getInner(cycle, remainingVertices);
        }
      }
    };

    getInner(cycle, Object.values(this.vertices));

    return cycles;
  }

  private restoreOrder(cycle: string[]) {
    let ret: string[] = [];
    let start = cycle[0];

    const getNext = (vertex: string) => {
      let adj = this.graph[vertex];
      if (!adj) return;
      ret.push(vertex);

      for (let neighbor of adj) {
        if (!ret.includes(neighbor.uuid) && cycle.includes(neighbor.uuid)) {
          getNext(neighbor.uuid);
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
    end: Vertex
  ) {
    if (start.uuid === end.uuid) return [start, parent];

    let ret: Vertex[] = [];
    let visited: string[] = [];

    visited.push(parent.uuid);
    ret.push(parent);

    let done: boolean = false;
    const getNext = (ver: Vertex) => {
      if (done) return;

      visited.push(ver.uuid);
      ret.push(ver);

      for (const neighbor of this.graph[ver.uuid]) {
        if (done) break;
        if (neighbor.uuid === start.uuid) continue;
        if (visited.includes(neighbor.uuid)) continue;

        if (neighbor.uuid === end.uuid) {
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
