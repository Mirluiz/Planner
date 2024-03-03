import THREE, { Vector3 } from "three";
import { Mesh } from "../engine/THREE/Mesh"; 
import { Scene as THREEScene } from './../../system/engine/THREE/Scene'

type Object = {
  position: Vector3;
  object: Mesh;
}

class Intersection {
  objects: Array<Object> = [];
  priorityObject: Object | null = null;


  constructor(readonly engine: THREEScene){
    this.initListeners();
  }


  private initListeners() {
    this.engine?.htmlElement?.addEventListener('mousemove', (event) => {
      if (!this.engine) return

      this.updateIntersection(this.engine.intersects);
    })
  }

  private updateIntersection(intersects: THREE.Intersection[]) {
    let intersections: Array<Object> = []

    this.engine?.scene.children.map((child) => {
      if (this.isBaseMesh(child.userData?.object)) {
        child.userData.object.onHoverEnd()
      }
    })

    intersects.map((intersect) => {
      let parent = this.getParent(intersect.object)

      if (parent && this.isBaseMesh(parent?.userData?.object)) {
        intersections.push({
          object: parent.userData.object,
          position: intersect.point
        })
        parent.userData.object.onHover(
          new Vector3(
            this.engine?.groundInters.x,
            this.engine?.groundInters.y,
            this.engine?.groundInters.z
          )
        )
      } else if (this.isBaseMesh(intersect.object?.userData?.object)) {
        intersections.push({
          object: intersect.object.userData.object,
          position: intersect.point
        })

        intersect.object.userData.object.onHover(
          new Vector3(
            this.engine?.groundInters.x,
            this.engine?.groundInters.y,
            this.engine?.groundInters.z


          )
        )
      }
    }) 
 
  }

  private isBaseMesh(object: any): object is Mesh {
    return object && 'isBaseMesh' in object
  }

  private getParent(mesh: THREE.Object3D) {
    let ret: THREE.Object3D | undefined

    const getParent = (mesh: THREE.Object3D): undefined | THREE.Object3D => {
      if (mesh.parent instanceof THREE.Scene || !mesh.parent) {
        return mesh
      } else if (mesh.parent) {
        return getParent(mesh.parent)
      }
    }

    if (mesh.parent) {
      ret = getParent(mesh.parent)
    }

    return ret
  }
}

export {Intersection} 