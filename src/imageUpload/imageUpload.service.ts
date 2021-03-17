import { Req, Res, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Image } from './image.entity';
import { NotAcceptableException } from '@nestjs/common';

@Injectable()
export class ImageUploadService {
  private storage;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {
    const spacesEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
    //Setup S3 storage
    this.storage = multerS3({
      s3: new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: this.configService.get<string>('aws.key'),
        secretAccessKey: this.configService.get<string>('aws.secret'),
        region: 'eu-central-1',
        signatureVersion: 'v4',
      }),
      bucket: this.configService.get<string>('aws.bucket') || 'frizerrose-images',
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    });
  }

  async fileUpload(@Req() request: Request, @Res() response: Response): Promise<any> {
    const files = await new Promise((resolve, reject) => {
      try {
        const upload = multer({
          storage: this.storage,
          fileFilter: this.imageFilter,
        }).any();

        upload(request, response, function (error: string) {
          if (error) {
            console.log(error);
            reject(`Failed to upload files: ${error}`);
          }
          //Return info about created files
          resolve(request.files);
        });
      } catch (error) {
        console.log(error);
        reject(`Failed to upload files: ${error}`);
      }
    });

    try {
      const imageData = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        link: files[0].location,
        company: null,
        staff: null,
      };

      let oldImage;
      if (request.body.staff) {
        imageData.staff = request.body.staff;
        oldImage = await this.imageRepository.findOne({ where: { staff: imageData.staff } });
      } else if (request.body.company) {
        imageData.company = request.body.company;
        oldImage = await this.imageRepository.findOne({ where: { company: imageData.company } });
      }

      if (oldImage) {
        await this.imageRepository.remove(oldImage);
      }

      return await this.imageRepository.save(this.imageRepository.create(imageData as Record<string, any>));
    } catch {
      throw new Error('Couldnt create image.');
    }
  }

  async get(id: number): Promise<Image | undefined> {
    return this.imageRepository.findOne(id);
  }

  async delete(id: number): Promise<Image> {
    const image = await this.get(id);

    if (!image) {
      throw new NotAcceptableException('Image does not exit.');
    }

    return await this.imageRepository.remove(image);
  }
  /**
   * Rejects all files if any of them are not an image.
   * @param request
   * @param file
   * @param cb
   */
  protected imageFilter(request: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // null should be new Error('Only image files are allowed!')
      return cb(null, false);
    }
    cb(null, true);
  }
}
