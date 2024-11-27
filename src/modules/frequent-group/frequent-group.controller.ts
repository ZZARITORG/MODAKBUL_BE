import { Controller } from '@nestjs/common';
import { FrequentGroupService } from './frequent-group.service';

@Controller('frequent-group')
export class FrequentGroupController {
  constructor(private readonly frequentGroupService: FrequentGroupService) {}
}
