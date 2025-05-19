import { Controller } from '@nestjs/common';
import { FrequentGroupService } from './frequent-group.service';

@Controller({ path: 'frequent-group', version: '0' })
export class FrequentGroupController {
  constructor(private readonly frequentGroupService: FrequentGroupService) {}
}
