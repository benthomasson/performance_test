# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from performance.models import RawCPU

class PerformanceConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = 'performance'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from room group
    async def perf_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


class CollectionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.cpu_buffer = []
        self.room_group_name = 'performance'

        await self.accept()

    async def disconnect(self, close_code):
        pass

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json[1]
        self.cpu_buffer.append(message)
        if (len(self.cpu_buffer)) > 100:
            self.write_cpu_buffer()

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'perf_message',
                'message': message
            }
        )

    def write_cpu_buffer(self):
        raw_cpus = [RawCPU(percent=x['data'][0]) for x in self.cpu_buffer]
        q = RawCPU.objects.bulk_create(raw_cpus)
        self.cpu_buffer = []


