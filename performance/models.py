from django.db import models


class RawCPU(models.Model):

    percent = models.FloatField()


class CPU(models.Model):

    percent = models.FloatField()

class ArchiveCPU(models.Model):

    percent = models.FloatField()

