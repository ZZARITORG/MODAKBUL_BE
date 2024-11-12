import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FrequentFriendService } from './frequent-friend.service';

@Controller('frequent-friend')
export class FrequentFriendController {
  constructor(private readonly frequentFriendService: FrequentFriendService) {}
}
