import { Injectable } from '@nestjs/common';
import { FrequentGroup } from 'src/common/db/entities/frequent_groups.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FrequentGroupService {
  constructor(private readonly frequentGroupRepository: Repository<FrequentGroup>) {}
}
