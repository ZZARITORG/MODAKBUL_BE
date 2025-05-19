import { Controller } from '@nestjs/common';
import { FrequentFriendService } from './frequent-friend.service';

@Controller({ path: 'frequent-friend', version: '0' })
export class FrequentFriendController {
  constructor(private readonly frequentFriendService: FrequentFriendService) {}
}
