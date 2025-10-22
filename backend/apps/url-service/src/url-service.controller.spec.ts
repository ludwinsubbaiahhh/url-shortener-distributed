import { Test, TestingModule } from '@nestjs/testing';
import { UrlServiceController } from './url-service.controller';
import { UrlServiceService } from './url-service.service';

describe('UrlServiceController', () => {
  let urlServiceController: UrlServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlServiceController],
      providers: [UrlServiceService],
    }).compile();

    urlServiceController = app.get<UrlServiceController>(UrlServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(urlServiceController.getHello()).toBe('Hello World!');
    });
  });
});
