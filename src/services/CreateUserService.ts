import { injectable } from 'tsyringe';
import { User } from '../schemas/User';

interface ICreateUserDTO {
  email: string;
  name: string;
  socket_id: string;
  avatar: string;
}

@injectable()
class CreateUserService {
  async execute({ email, name, socket_id, avatar }: ICreateUserDTO) {
    const userAlreadyExists = await User.findOne({
      email,
    }).exec();

    if (userAlreadyExists) {
      const user = await User.findOneAndUpdate(
        {
          _id: userAlreadyExists._id,
        },
        {
          $set: { socket_id, avatar, name },
        },
        {
          new: true,
        },
      );

      return user;
    }
    const user = await User.create({
      email,
      name,
      socket_id,
      avatar,
    });

    return user;
  }
}

export { CreateUserService };
