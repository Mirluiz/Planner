// type Item = {
//   settings: {
//     emptyContainer: boolean
//     autoSave: boolean
//     containerBorders: boolean
//   }
//   camera: {
//     zoom: number
//     type: '3D' | '2D'
//     position?: {x: number; y: number; z: number}
//     lookAt?: {x: number; y: number; z: number}
//   }
// }
//
// class LocalSettings {
//   settings: Item['settings']
//   camera: Item['camera']
//
//   constructor(params?: Item) {
//     if (params?.settings) {
//       this.settings = params.settings
//     } else {
//       this.settings = {
//         autoSave: false,
//         containerBorders: false,
//         emptyContainer: false
//       }
//     }
//
//     if (params?.camera) {
//       this.camera = params.camera
//     } else {
//       this.camera = {
//         zoom: 1,
//         type: '3D',
//         position: {
//           x: 3,
//           y: 3,
//           z: 3
//         },
//         lookAt: {
//           x: 0,
//           y: 0,
//           z: 0
//         }
//       }
//     }
//   }
//
//   save() {
//     localStorage.setItem('camera', JSON.stringify(this.camera))
//     localStorage.setItem('settings', JSON.stringify(this.settings))
//   }
//
//   load() {
//     let ret: Item | null = null
//
//     let settingsString = localStorage.getItem('settings')
//     let cameraString = localStorage.getItem('camera')
//     if (settingsString && cameraString) {
//       ret = {
//         camera: JSON.parse(cameraString),
//         settings: JSON.parse(settingsString)
//       }
//     }
//
//     if (ret) {
//       this.camera = ret.camera
//       this.settings = ret.settings
//     }
//   }
// }
//
// export {LocalSettings}
