# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
import json

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
        print (event)
        message = event['message']
        print (message)

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

class CollectionConsumer(AsyncWebsocketConsumer):

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

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print (text_data)
        print (text_data_json)
        message = text_data_json[1]

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'perf_message',
                'message': message
            }
        )

    async def perf_message(self, event):
        print (event)
