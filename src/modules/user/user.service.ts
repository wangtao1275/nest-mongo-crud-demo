import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('USER_MODEL') private readonly userModel: Model<User>,
  ) {}

  /*
   *@Description: 用户注册方法
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-19 17:38:20
   */
  public async regist(user: User) {
    return this.userModel
      .find({
        phone: user.phone,
      })
      .then((res) => {
        if (res.length) {
          console.log('该用户已经注册');
          throw Error('该用户已经注册');
        }
      })
      .then(() => {
        try {
          const createUser = new this.userModel(user);
          return createUser.save();
        } catch (error) {
          console.log('保存用户失败' + error);
        }
      })
      .catch((err) => {
        console.warn('发生问题' + err);
      });
  }
}
