import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, organizerId: string) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
        availableTickets: createEventDto.capacity,
        status: EventStatus.DRAFT,
        organizerId,
      },
    });
  }

  async findAllPublished() {
    return this.prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }
    return event;
  }

  async findByOrganizer(organizerId: string) {
    return this.prisma.event.findMany({
      where: { organizerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            tickets: true,
            reservations: true,
          },
        },
      },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto, organizerId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('Apenas o organizador do evento pode alterá-lo');
    }

    const dataToUpdate: any = { ...updateEventDto };
    if (updateEventDto.date) {
      dataToUpdate.date = new Date(updateEventDto.date);
    }

    return this.prisma.event.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async publish(id: string, organizerId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('Apenas o organizador do evento pode publicá-lo');
    }
    if (event.status === EventStatus.PUBLISHED) {
      throw new BadRequestException('Evento já está publicado');
    }

    return this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.PUBLISHED },
    });
  }

  async cancel(id: string, organizerId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('Apenas o organizador do evento pode cancelá-lo');
    }

    return this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.CANCELLED },
    });
  }
}
