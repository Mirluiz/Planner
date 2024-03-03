import { Vector3, Scene } from 'three'
import { Mesh } from '../engine/THREE/Mesh'
import { Scene as THREEScene } from './../../system/engine/THREE/Scene'

type Object = {
  position: THREE.Vector3
  object: Mesh
}

class Intersection {
  objects: Array<Object> = []
  priorityObject: Object | null = null

  constructor(readonly engine: THREEScene) {}

  update(intersects: THREE.Intersection[]) {
    let intersections: Array<Object> = []

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

        parent.userData.object.reRender2D()
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

        intersect.object.userData.object.reRender2D()
      }
    })

    this.engine?.scene.children.map((child) => {
      if (this.isBaseMesh(child.userData?.object)) {
        if (
          child.userData.object.hovered &&
          !intersections.find((inter) => inter.object.uuid === child.userData.object.uuid)
        ) {
          child.userData.object.onHoverEnd()
          child.userData.object.reRender2D()
        }
      }
    })

    this.objects = intersections
    this.priorityObject = intersections[0]
  }

  private isBaseMesh(object: any): object is Mesh {
    return object && 'isBaseMesh' in object
  }

  private getParent(mesh: THREE.Object3D) {
    let ret: THREE.Object3D | undefined

    const getParent = (mesh: THREE.Object3D): undefined | THREE.Object3D => {
      if (mesh.parent instanceof Scene || !mesh.parent) {
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

  getClickedObjectInfo() {
    let info: {
      centerOffset: Vector3
      position: Vector3
      object: Mesh
      initialData: { position: Vector3 }
    } | null = null

    let ground = new Vector3(
      this.engine?.groundInters.x,
      this.engine?.groundInters.y,
      this.engine?.groundInters.z
    )

    if (this.priorityObject?.object) {
      info =
        {
          centerOffset: ground
            .clone()
            .sub(
              new Vector3(
                this.priorityObject.object.position.x,
                this.priorityObject.object.position.y,
                this.priorityObject.object.position.z
              )
            ),
          object: this.priorityObject.object,
          position: this.priorityObject.position.clone(),
          initialData: {
            position: ground
          }
        } ?? null
    }

    return info
  }
}

export { Intersection }
