import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { User } from 'src/interfaces/user.interface';

const logger = new Logger('user.service');

@Injectable()
export class UserService {
  private response: IResponse;

  constructor(
    @InjectModel('USER_MODEL') private readonly userModel: Model<User>,
  ) {}

  /*
   *@Description: 用户注册方法
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-19 17:38:20
   */
  public async regist(user: User) {
    return this.findOneByPhone(user.phone)
      .then((res) => {
        if (res.length) {
          this.response = {
            code: 1,
            msg: '当前手机号已经注册',
          };
          throw this.response
        }
      })
      .then(async () => {
        try {
          const createUser = new this.userModel(user);
          await createUser.save();
          this.response = {
            code: 0,
            msg: '注册成功',
          };
          return this.response;
        } catch (error) {
          this.response = {
            code: 2,
            msg: '用户注册失败，请联系相关负责人。错误详情：' + error,
          };
          throw this.response;
        }
      })
      .catch((err) => {
        logger.log(`${user.phone}: ${err.msg}`);
        return this.response
      });
  }

  /*
   *@Description: 通过手机号查找用户
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-19 21:08:04
   */
  async findOneByPhone(phone: string) {
    return await this.userModel.find({ phone });
  }
}
