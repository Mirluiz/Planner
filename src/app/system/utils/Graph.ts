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
    u: { val: string; pos: { x: number; y: number } },
    v: { val: string; pos: { x: number; y: number } }
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
        this.thetaSort(current, a, b)
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

          queue = [];
          break;
        }
      }
    }

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

  private removeDuplicate(cycles: string[][]) {
    let duplicatedRemove: string[][] = [];

    let _i = 0;
    while (_i < cycles.length) {
      cycles.map((cycle) => {
        if (
          !duplicatedRemove.find(
            (c) => [...c].sort().join("") === [...cycle].sort().join("")
          )
        ) {
          let order = this.restoreOrder(cycle);
          if (order) {
            duplicatedRemove.push(order);
          }
          // duplicatedRemove.push(this.restoreOrder(cycle));
        }
      });

      _i++;
    }

    return duplicatedRemove;
  }

  private restoreOrder(cycle: string[]) {
    let ret: string[] = [];

    const getNext = (vertex: string) => {
      let adj = this.graph[vertex];
      if (!adj) return;
      ret.push(vertex);

      for (let neighbor of adj) {
        if (!ret.includes(neighbor.val)) {
          getNext(neighbor.val);
        }
      }
    };

    getNext(cycle[0]);

    return ret.length > 0 ? ret : null;
  }
}

export { Graph };
