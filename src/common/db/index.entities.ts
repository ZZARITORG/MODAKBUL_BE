import { FriendShip } from './entities/friendship.entity';
import { Group, GroupMember } from './entities/group.entity';
import { Meeting } from './entities/meeting.entity';
import { Notification } from './entities/notification.entitiy';
import { UserMeetingRelation } from './entities/user-meeting-relation.entity';
import { User } from './entities/user.entity';

export const indexEntities = [User, UserMeetingRelation, Notification, Meeting, Group, FriendShip, GroupMember];
