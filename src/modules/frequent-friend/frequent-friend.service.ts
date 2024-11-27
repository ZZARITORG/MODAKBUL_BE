import { Injectable } from '@nestjs/common';
import { FrequentFriend } from 'src/common/db/entities/frequent_friends.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FrequentFriendService {
  constructor(private readonly frequentFriendRepository: Repository<FrequentFriend>) {}
}
