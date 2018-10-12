# chat/consumers.py
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from performance.models import RawCPU
import logging
import random


logger = logging.getLogger('peformance_test.consumers')


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
        await self.send(text_data=json.dumps(message));


class CollectionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.cpu_buffer = []
        self.mem_buffer = []
        self.room_group_name = 'performance'

        await self.accept()

    async def disconnect(self, close_code):
        pass

    def get_handler(self, message_type):
        return getattr(self, "on{0}".format(message_type), None)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json[0]
        message = text_data_json[1]
        handler = self.get_handler(message_type)
        if handler is not None:
            await handler(message)
        else:
            logger.warning("Unsupported message %s", message)
            print("Unsupported message %s", message)

    async def onCpuUsage(self, message):
        self.cpu_buffer.append(message)
        if (len(self.cpu_buffer)) > 100:
            await self.write_cpu_buffer()

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'perf_message',
                'message': ['CpuUsage', message]
            }
        )

    async def onEvent(self, message):

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'perf_message',
                'message': ['Event', message]
            }
        )


    async def onMemUsage(self, message):
        self.mem_buffer.append(message)
        if (len(self.mem_buffer)) > 100:
            await self.write_mem_buffer()

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'perf_message',
                'message': ['MemUsage', message]
            }
        )

    @database_sync_to_async
    def write_cpu_buffer(self):
        raw_cpus = [RawCPU(percent=x['cpu_percent']) for x in self.cpu_buffer]
        RawCPU.objects.bulk_create(raw_cpus)
        self.cpu_buffer = []

    @database_sync_to_async
    def write_mem_buffer(self):
        pass
