import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AnalyticsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  public sendAnalyticsUpdate(shortCode: string, payload: any) {
    if (!this.server) return;
    this.server.to(shortCode).emit('analytics_update', payload);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, payload: { shortCode: string }) {
    if (payload?.shortCode) {
      client.join(payload.shortCode);
    }
  }
}


