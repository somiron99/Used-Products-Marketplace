// Socket.io instance will be set from server.js
let ioInstance: any = null;

export function setSocketIOInstance(io: any) {
  ioInstance = io;
}

export function getSocketIOInstance() {
  return ioInstance;
}

export function emitToRoom(roomId: string, event: string, data: any) {
  if (ioInstance) {
    ioInstance.to(roomId).emit(event, data);
  }
}

