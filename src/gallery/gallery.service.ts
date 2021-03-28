import { CacheStore, CACHE_MANAGER, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { GalleryCreateDto, GalleryUpdateDto } from './dto/index';
import { Gallery } from './gallery.entity';

@Injectable()
export class GallerysService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async getAll(): Promise<Gallery[] | undefined> {
    let galleries: Gallery[] | undefined = await this.cacheStore.get('all_galleries');

    if (galleries) {
      this.logger.log('Getting all galleries from cache.');
      return galleries;
    }

    galleries = await this.galleryRepository.find();
    if (galleries) {
      this.cacheStore.set('all_galleries', galleries, { ttl: 20 });
    }

    this.logger.log('Querying all gallery!');
    return galleries;
  }

  async get(id: number): Promise<Gallery | undefined> {
    return this.galleryRepository.findOne(id);
  }

  // async getByClinicID(id: string): Promise<Gallery | undefined> {
  //   return await this.galleryRepository
  //     .createQueryBuilder('gallery')
  //     .where('gallery.clinic = :id')
  //     .setParameter('id', id)
  //     .getOne();
  // }

  async create(payload: GalleryCreateDto): Promise<Gallery> {
    // const oldGallery = await this.getByClinicID(payload.clinic);

    // if (oldGallery) {
    //   throw new NotAcceptableException('Gallery for provided clinic already created.');
    // }

    return await this.galleryRepository.save(this.galleryRepository.create(payload as Record<string, any>));
  }

  async update(payload: GalleryUpdateDto): Promise<Gallery> {
    const oldGallery = await this.get(payload.id);

    if (!oldGallery) {
      throw new NotAcceptableException('Gallery with provided id not yet created.');
    }

    return await this.galleryRepository.save(payload);
  }

  async delete(id: number): Promise<Gallery> {
    const oldGallery = await this.get(id);

    if (!oldGallery) {
      throw new NotAcceptableException('Gallery does not exit.');
    }

    return await this.galleryRepository.remove(oldGallery);
  }
}
